import { supabaseAdmin } from "@/lib/supabase/admin";

export class EnterpriseCrmService {
  // --- Companies (Accounts) ---
  static async getCompanies(filters: any = {}) {
    let query = supabaseAdmin.from("companies").select("*, owner:team_members(name)");
    if (filters.owner_id) query = query.eq("owner_id", filters.owner_id);
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.search) query = query.ilike("name", `%${filters.search}%`);
    
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }

  static async getCompanyById(id: string) {
    const { data, error } = await supabaseAdmin
      .from("companies")
      .select("*, owner:team_members(name), contacts(*), deals(*), documents(*)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  static async createCompany(company: any) {
    const { data, error } = await supabaseAdmin.from("companies").insert(company).select().single();
    if (error) throw error;
    // Log timeline event
    await this.logTimelineEvent({
      company_id: data.id,
      event_type: "created",
      description: `Company Account "${data.name}" created`
    });
    return data;
  }

  static async updateCompany(id: string, updates: any) {
    const { data, error } = await supabaseAdmin.from("companies").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  static async deleteCompany(id: string) {
    const { error } = await supabaseAdmin.from("companies").delete().eq("id", id);
    if (error) throw error;
    return true;
  }

  // --- Contacts ---
  static async getContacts(filters: any = {}) {
    let query = supabaseAdmin.from("contacts").select("*, company:companies(name)");
    if (filters.company_id) query = query.eq("company_id", filters.company_id);
    if (filters.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`);
    }
    const { data, error } = await query.order("first_name", { ascending: true });
    if (error) throw error;
    return data;
  }

  static async createContact(contact: any) {
    const { data, error } = await supabaseAdmin.from("contacts").insert(contact).select().single();
    if (error) throw error;
    // Log timeline
    await this.logTimelineEvent({
      company_id: data.company_id,
      contact_id: data.id,
      event_type: "created",
      description: `Contact "${data.first_name} ${data.last_name || ''}" added`
    });
    return data;
  }

  // --- Deals ---
  static async getDeals(filters: any = {}) {
    let query = supabaseAdmin.from("deals").select("*, company:companies(name), primary_contact:contacts(first_name, last_name), stage:deal_stages(name)");
    if (filters.company_id) query = query.eq("company_id", filters.company_id);
    if (filters.stage_id) query = query.eq("stage_id", filters.stage_id);
    if (filters.owner_id) query = query.eq("owner_id", filters.owner_id);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }

  static async getDealStages() {
    const { data, error } = await supabaseAdmin.from("deal_stages").select("*").order("order_index", { ascending: true });
    if (error) throw error;
    return data;
  }

  static async createDeal(deal: any) {
    const { data, error } = await supabaseAdmin.from("deals").insert(deal).select().single();
    if (error) throw error;
    await this.logTimelineEvent({
      company_id: data.company_id,
      contact_id: data.primary_contact_id,
      deal_id: data.id,
      event_type: "created",
      description: `Deal "${data.name}" created with value ${data.currency} ${data.value}`
    });
    return data;
  }

  static async updateDealStage(dealId: string, stageId: string) {
    const { data: stage } = await supabaseAdmin.from("deal_stages").select("name").eq("id", stageId).single();
    const stageName = stage?.name || "new stage";
    
    const { data, error } = await supabaseAdmin
      .from("deals")
      .update({ stage_id: stageId, updated_at: new Date().toISOString() })
      .eq("id", dealId)
      .select()
      .single();
    
    if (error) throw error;

    await this.logTimelineEvent({
      company_id: data.company_id,
      contact_id: data.primary_contact_id,
      deal_id: data.id,
      event_type: "deal_stage_change",
      description: `Deal stage updated to: "${stageName}"`
    });

    return data;
  }

  // --- Activities Stream (Unified Timeline) ---
  static async getUnifiedTimeline(filters: any) {
    let query = supabaseAdmin
      .from("timeline_events")
      .select("*");
    
    if (filters.company_id) query = query.eq("company_id", filters.company_id);
    if (filters.contact_id) query = query.eq("contact_id", filters.contact_id);
    if (filters.deal_id) query = query.eq("deal_id", filters.deal_id);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }

  static async logTimelineEvent(event: {
    company_id: string;
    contact_id?: string;
    deal_id?: string;
    event_type: string;
    description: string;
    reference_id?: string;
  }) {
    const { error } = await supabaseAdmin.from("timeline_events").insert(event);
    if (error) console.error("Failed to log timeline event:", error);
  }

  // --- Lead Promotion Workflow ---
  static async promoteLeadToEnterprise(leadId: string) {
    // 1. Fetch current lead
    const { data: lead, error } = await supabaseAdmin.from("leads").select("*").eq("id", leadId).single();
    if (error || !lead) throw new Error("Lead not found");

    // 2. Create Company
    const company = await this.createCompany({
      name: lead.business_name || `${lead.name || 'Unknown'} Company`,
      website: lead.website_url,
      city: lead.city,
      status: "prospect",
      notes: `Promoted from Lead ID: ${lead.id}\nScore: ${lead.lead_score}\nNotes: ${lead.notes || ''}`
    });

    // 3. Create Primary Contact
    const [firstName, ...lastNameParts] = (lead.name || "Contact").split(" ");
    const lastName = lastNameParts.join(" ") || null;
    const contact = await this.createContact({
      company_id: company.id,
      first_name: firstName,
      last_name: lastName,
      email: lead.email || `contact_${leadId.slice(0,6)}@growxlabs.tech`,
      phone: lead.phone,
      linkedin_url: lead.linkedin_url,
      is_decision_maker: true,
      notes: "Auto-promoted from leads table."
    });

    // 4. Update deal status / create deal
    const deal = await this.createDeal({
      name: `${company.name} Initial Deal`,
      company_id: company.id,
      primary_contact_id: contact.id,
      value: 50000.00, // default estimation
      currency: "INR",
      stage_id: "NEW_LEAD", // will resolve based on default stages seed
      source: lead.source || "Scraper"
    });

    // 5. Update parent lead status to promote
    await supabaseAdmin.from("leads").update({ status: "qualified" }).eq("id", leadId);
    
    return { company, contact, deal };
  }
}
