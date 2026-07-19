import { supabaseAdmin } from "@/lib/supabase/admin";

interface JournalItemInput {
  account_code: string;
  debit: number;
  credit: number;
  description?: string;
}

export class EnterpriseFinanceService {
  /**
   * Posts a double-entry journal voucher.
   * Assures that total debits exactly balance total credits before writing.
   */
  static async postJournalEntry(
    entryDate: string,
    reference: string,
    description: string,
    items: JournalItemInput[],
    postedById?: string
  ) {
    // 1. Calculate Debit and Credit sums
    const totalDebits = items.reduce((acc, item) => acc + Number(item.debit || 0), 0);
    const totalCredits = items.reduce((acc, item) => acc + Number(item.credit || 0), 0);

    // Round to 2 decimals to prevent floating point inaccuracies
    const debitsRounded = Math.round(totalDebits * 100) / 100;
    const creditsRounded = Math.round(totalCredits * 100) / 100;

    if (debitsRounded !== creditsRounded) {
      throw new Error(`Double-entry balance check failed. Debits (₹${debitsRounded}) must equal Credits (₹${creditsRounded})`);
    }

    // 2. Insert Entry Header
    const { data: entry, error: entryErr } = await supabaseAdmin
      .from("journal_entries")
      .insert({
        entry_date: entryDate,
        reference,
        description,
        posted_by_id: postedById || null
      })
      .select()
      .single();

    if (entryErr || !entry) {
      throw new Error(`Failed to post journal header: ${entryErr?.message}`);
    }

    // 3. Process Each Line Item
    for (const item of items) {
      // Find account ID from account code
      const { data: account, error: accErr } = await supabaseAdmin
        .from("chart_of_accounts")
        .select("id, balance, type")
        .eq("code", item.account_code)
        .single();

      if (accErr || !account) {
        throw new Error(`Chart of Account code '${item.account_code}' not found.`);
      }

      // Insert Journal Line Item
      const { error: itemErr } = await supabaseAdmin
        .from("journal_items")
        .insert({
          entry_id: entry.id,
          account_id: account.id,
          debit: item.debit,
          credit: item.credit,
          description: item.description || description
        });

      if (itemErr) throw itemErr;

      // Calculate new account balance
      // Asset/Expense accounts increase with Debit, decrease with Credit.
      // Liability/Equity/Income accounts increase with Credit, decrease with Debit.
      let balanceChange = 0;
      if (account.type === "ASSET" || account.type === "EXPENSE") {
        balanceChange = Number(item.debit) - Number(item.credit);
      } else {
        balanceChange = Number(item.credit) - Number(item.debit);
      }

      const newBalance = Number(account.balance) + balanceChange;
      
      const { error: updateErr } = await supabaseAdmin
        .from("chart_of_accounts")
        .update({ balance: newBalance })
        .eq("id", account.id);

      if (updateErr) throw updateErr;
    }

    return entry;
  }

  /**
   * Promotes a CRM quotation into an active Invoice.
   */
  static async convertQuotationToInvoice(quotationId: string, dueDate: string) {
    const { data: quote, error: qErr } = await supabaseAdmin
      .from("quotations")
      .select("*, company:companies(*)")
      .eq("id", quotationId)
      .single();

    if (qErr || !quote) throw new Error("Quotation not found");

    // Insert Invoice
    const invoiceNum = `INV-${Date.now().toString().slice(-6)}`;
    const { data: invoice, error: invErr } = await supabaseAdmin
      .from("invoices")
      .insert({
        invoice_number: invoiceNum,
        company_id: quote.company_id,
        subtotal: quote.total_amount,
        tax_amount: quote.tax_amount,
        discount_amount: quote.discount_amount || 0,
        grand_total: quote.grand_total,
        status: "DRAFT",
        due_date: dueDate,
        payment_terms: "NET 30"
      })
      .select()
      .single();

    if (invErr || !invoice) throw new Error(`Invoice compilation failed: ${invErr?.message}`);

    // Fetch quotation items and replicate to invoice items
    const { data: qItems } = await supabaseAdmin
      .from("quotation_items")
      .select("*")
      .eq("quotation_id", quotationId);

    if (Array.isArray(qItems) && qItems.length > 0) {
      const invItems = qItems.map(item => ({
        invoice_id: invoice.id,
        product_id: item.product_id,
        description: `Deliverable setup item`,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));
      await supabaseAdmin.from("invoice_items").insert(invItems);
    }

    // Auto-Post Journal Ledger: Debit Accounts Receivable (1200), Credit SaaS Licensing Revenue (4010)
    await this.postJournalEntry(
      new Date().toISOString().split("T")[0],
      invoiceNum,
      `Sales Invoice Generated for ${quote.company?.name}`,
      [
        { account_code: "1200", debit: Number(invoice.grand_total), credit: 0 },
        { account_code: "4010", debit: 0, credit: Number(invoice.grand_total) }
      ]
    );

    return invoice;
  }

  /**
   * Records an invoice payment and posts a balancing ledger entry.
   * Debits Bank Account (1010), Credits Accounts Receivable (1200).
   */
  static async recordPayment(invoiceId: string, amount: number, method: any, txId: string) {
    const { data: invoice, error: invErr } = await supabaseAdmin
      .from("invoices")
      .select("*, company:companies(name)")
      .eq("id", invoiceId)
      .single();

    if (invErr || !invoice) throw new Error("Invoice not found");

    // Insert Payment Record
    const { data: payment, error: payErr } = await supabaseAdmin
      .from("payments")
      .insert({
        invoice_id: invoiceId,
        amount,
        payment_method: method,
        transaction_id: txId,
        payment_date: new Date().toISOString().split("T")[0],
        status: "COMPLETED"
      })
      .select()
      .single();

    if (payErr) throw payErr;

    // Update Invoice Status
    const isFullyPaid = Number(amount) >= Number(invoice.grand_total);
    await supabaseAdmin
      .from("invoices")
      .update({ status: isFullyPaid ? "PAID" : "PARTIALLY_PAID" })
      .eq("id", invoiceId);

    // Double-Entry Ledger Posting: Debit Cash (1010), Credit Accounts Receivable (1200)
    await this.postJournalEntry(
      new Date().toISOString().split("T")[0],
      invoice.invoice_number,
      `Payment received for Invoice ${invoice.invoice_number}`,
      [
        { account_code: "1010", debit: Number(amount), credit: 0 },
        { account_code: "1200", debit: 0, credit: Number(amount) }
      ]
    );

    return payment;
  }
}
