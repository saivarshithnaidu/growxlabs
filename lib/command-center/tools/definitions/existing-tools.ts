export const TOOLS_DEFINITIONS = [
  {
    name: "get_company_stats",
    description: "Retrieve general business statistics including total lead count, status breakdown, and recent leads.",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "query_leads",
    description: "Query the leads database with optional filters for status, city, or record limit.",
    parameters: {
      type: "object",
      properties: {
        status: { type: "string", description: "Filter leads by status (e.g. 'new', 'contacted', 'qualified', 'lost')" },
        city: { type: "string", description: "Filter leads by city name" },
        limit: { type: "number", description: "Maximum number of records to return (default 10, max 50)" }
      }
    }
  },
  {
    name: "create_lead",
    description: "Insert a new lead record into the database.",
    parameters: {
      type: "object",
      properties: {
        business_name: { type: "string", description: "Name of the business" },
        city: { type: "string", description: "City where business is located" },
        email: { type: "string", description: "Email address for contact" },
        phone: { type: "string", description: "Phone number for contact" },
        name: { type: "string", description: "Name of contact person" },
        website_url: { type: "string", description: "Website URL of the business" },
        notes: { type: "string", description: "Optional notes about the lead" }
      },
      required: ["business_name", "city", "email", "phone"]
    }
  },
  {
    name: "create_leads_batch",
    description: "Insert multiple new lead records into the database at once. Use this to batch-save collected leads.",
    parameters: {
      type: "object",
      properties: {
        leads: {
          type: "array",
          description: "List of leads to insert",
          items: {
            type: "object",
            properties: {
              business_name: { type: "string", description: "Name of the business (required)" },
              city: { type: "string", description: "City where business is located (required)" },
              email: { type: "string", description: "Email address for contact" },
              phone: { type: "string", description: "Phone number for contact" },
              name: { type: "string", description: "Name of contact person" },
              website_url: { type: "string", description: "Website URL of the business" },
              notes: { type: "string", description: "Optional notes about the lead" }
            },
            required: ["business_name", "city"]
          }
        }
      },
      required: ["leads"]
    }
  },
  {
    name: "generate_proposal",
    description: "Generate and persist a new Scope of Work (SOW) client proposal.",
    parameters: {
      type: "object",
      properties: {
        clientName: { type: "string", description: "Name of client contact person" },
        businessName: { type: "string", description: "Name of client business" },
        selectedPackage: { type: "string", description: "Selected package (e.g. 'Standard Tier', 'Growth Tier', 'Enterprise Suite')" },
        customPrice: { type: "string", description: "Optional custom pricing override as a string (e.g. '₹7,50,000')" },
        problem: { type: "string", description: "Brief description of the client's operational problem" },
        impact: { type: "string", description: "Estimated financial impact of the pain point" },
        validDays: { type: "number", description: "Number of days the proposal remains valid (default 7)" }
      },
      required: ["clientName", "businessName", "selectedPackage"]
    }
  },
  {
    name: "search_web",
    description: "Perform a live web search to retrieve real-time market data or search engine results.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "The search query string" },
        num: { type: "number", description: "Maximum number of search results to return (default 10, max 80)" }
      },
      required: ["query"]
    }
  },
  {
    name: "spawn_subagent",
    description: "Spawn a specialized subagent to perform focused background research, data gathering, or analysis on a specific topic.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Descriptive name of the subagent, e.g. 'Real Estate Growth Agent'" },
        focus: { type: "string", description: "The specific topic or search query the subagent should research" },
        mission: { type: "string", description: "The specific mission or goal, e.g. 'Identify top real estate agencies in Miami'" }
      },
      required: ["name", "focus", "mission"]
    }
  },
  {
    name: "get_blog_posts_stats",
    description: "Retrieve all blog posts from the database including their title, slug, sent status, and published date.",
    parameters: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Maximum number of records to return (default 20)" }
      },
      required: []
    }
  },
  {
    name: "query_wish_game_data",
    description: "Query the wish game subscribers and telemetry logs from the database.",
    parameters: {
      type: "object",
      properties: {
        searchQuery: { type: "string", description: "Search by name, email, or wish text" },
        limit: { type: "number", description: "Maximum number of records to return (default 20)" }
      },
      required: []
    }
  },
  {
    name: "send_blog_to_subscribers",
    description: "Send/dispatch a specific blog post to all active subscribers via email newsletter.",
    parameters: {
      type: "object",
      properties: {
        blogPostId: { type: "string", description: "The UUID of the blog post to dispatch to subscribers." }
      },
      required: ["blogPostId"]
    }
  },
  {
    name: "get_admin_users",
    description: "Retrieve list of registered client users in the system, optionally filtered by a name or email search query.",
    parameters: {
      type: "object",
      properties: {
        searchQuery: { type: "string", description: "Search query for name or email" },
        limit: { type: "number", description: "Maximum number of records to return (default 20)" }
      },
      required: []
    }
  },
  {
    name: "get_admin_agreements",
    description: "Retrieve a list of client agreements (contracts) with their values, dates, and statuses.",
    parameters: {
      type: "object",
      properties: {
        clientId: { type: "string", description: "Optional UUID of the client user to filter by" },
        limit: { type: "number", description: "Maximum number of records to return (default 20)" }
      },
      required: []
    }
  },
  {
    name: "get_admin_projects",
    description: "Retrieve a list of client development projects and their current completion progress (0-100).",
    parameters: {
      type: "object",
      properties: {
        clientId: { type: "string", description: "Optional UUID of the client user to filter by" },
        limit: { type: "number", description: "Maximum number of records to return (default 20)" }
      },
      required: []
    }
  },
  {
    name: "create_admin_project",
    description: "Create and persist a new development project milestone for a specific client user.",
    parameters: {
      type: "object",
      properties: {
        clientId: { type: "string", description: "The UUID of the client user (required)" },
        title: { type: "string", description: "The descriptive title of the project (required)" },
        status: { type: "string", description: "Initial status of the project (default 'pending', e.g. 'pending', 'active', 'completed')" },
        progress: { type: "number", description: "Initial progress percentage from 0 to 100 (default 0)" }
      },
      required: ["clientId", "title"]
    }
  },
  {
    name: "get_daily_brief",
    description: "What needs the founder's attention today across the business: payments to verify, overdue invoices, signed agreements to invoice, lead follow-ups due, proposals waiting for internal review, blocked delivery tasks and today's discovery meetings. Use it for 'what needs me today', 'daily brief', 'what should I do', 'morning summary'. Answer with the few items that matter most, most urgent first.",
    parameters: { type: "object", properties: {}, required: [] }
  },
  {
    name: "get_billing_overview",
    description: "Consulting billing at a glance: totals invoiced, received and outstanding; overdue invoices; payments waiting for verification; signed agreements not yet invoiced. Use this for any general billing or money question.",
    parameters: { type: "object", properties: {}, required: [] }
  },
  {
    name: "list_consulting_invoices",
    description: "List consulting milestone invoices (GXL-INV-...) with client, total, paid, balance, issued and due dates, and whether each is overdue.",
    parameters: {
      type: "object",
      properties: {
        status: { type: "string", description: "Optional status: draft, sent, partially_paid, paid, overdue" },
        unpaidOnly: { type: "boolean", description: "Only invoices with a balance still due" },
        search: { type: "string", description: "Invoice number or client name to match" },
        limit: { type: "number", description: "Maximum rows (default 20, max 50)" }
      },
      required: []
    }
  },
  {
    name: "list_consulting_payments",
    description: "List client payment submissions (GXL-PAY-...). Defaults to payments waiting for verification.",
    parameters: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["verification_required", "verified", "failed", "all"], description: "Which payments to list (default verification_required)" },
        limit: { type: "number", description: "Maximum rows (default 20, max 50)" }
      },
      required: []
    }
  },
  {
    name: "issue_consulting_invoice",
    description: "Issue a consulting invoice to its client. This does not run immediately: it returns an approval request and the user approves it on a card in the chat. After calling it, tell the user in one short line to approve the card.",
    parameters: {
      type: "object",
      properties: { invoice: { type: "string", description: "Invoice number, e.g. GXL-INV-2026-000001" } },
      required: ["invoice"]
    }
  },
  {
    name: "decide_consulting_payment",
    description: "Verify or reject a payment waiting for verification. Verifying updates the invoice balance, issues a receipt and notifies the client. This does not run immediately: it returns an approval request the user approves on a card. After calling it, tell the user in one short line to approve the card.",
    parameters: {
      type: "object",
      properties: {
        payment: { type: "string", description: "Payment number, e.g. GXL-PAY-2026-000003" },
        decision: { type: "string", enum: ["verify", "reject"], description: "verify or reject" }
      },
      required: ["payment", "decision"]
    }
  },
  {
    name: "create_milestone_invoice",
    description: "Create the milestone invoice for a signed agreement. Milestone 0 is the advance. Later milestones need triggerConfirmed=true, which you may only set when the user has said that milestone's trigger was reached. Returns an approval request the user approves on a card.",
    parameters: {
      type: "object",
      properties: {
        agreement: { type: "string", description: "Agreement number, e.g. GXL-MSA-2026-000001" },
        milestoneIndex: { type: "number", description: "0 for the first (advance) milestone, 1 for the second, and so on" },
        triggerConfirmed: { type: "boolean", description: "Only true when the user confirmed the milestone trigger was reached" }
      },
      required: ["agreement"]
    }
  },
  {
    name: "create_artifact",
    description: "Create a file the user can open in the side panel and download: a document (Markdown), a spreadsheet (CSV, opens in Excel) or a PDF. Use it when the user asks for a file, export, report, sheet or PDF. Fill it only with data from tool results in this conversation or text the user gave you; fetch the data with a read tool first if needed. After creating it, say in one short line what it contains.",
    parameters: {
      type: "object",
      properties: {
        format: { type: "string", enum: ["document", "spreadsheet", "pdf"], description: "document, spreadsheet or pdf" },
        name: { type: "string", description: "File name without extension, e.g. Unpaid invoices October 2026" },
        title: { type: "string", description: "Title shown at the top of the file" },
        sections: {
          type: "array",
          description: "Optional text sections",
          items: {
            type: "object",
            properties: {
              heading: { type: "string", description: "Optional section heading" },
              body: { type: "string", description: "Section text; plain text or simple markdown" }
            },
            required: ["body"]
          }
        },
        table: {
          type: "object",
          description: "Optional table; required for a spreadsheet",
          properties: {
            headers: { type: "array", items: { type: "string" }, description: "Column headings" },
            rows: { type: "array", items: { type: "array", items: { type: "string" } }, description: "Rows of cell values, in header order" }
          },
          required: ["headers", "rows"]
        }
      },
      required: ["format", "name", "title"]
    }
  }
];

export const OPENAI_TOOLS = TOOLS_DEFINITIONS.map(d => ({
  type: "function" as const,
  function: {
    name: d.name,
    description: d.description,
    parameters: d.parameters
  }
}));
