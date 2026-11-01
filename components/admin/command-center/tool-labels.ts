/** Plain-language steps for the live progress list: what is happening now, and what happened. */
const LABELS: Record<string, { doing: string; done: string }> = {
  get_company_stats: { doing: "Reading company stats", done: "Read company stats" },
  query_leads: { doing: "Searching leads", done: "Searched leads" },
  create_lead: { doing: "Adding the lead", done: "Added the lead" },
  create_leads_batch: { doing: "Importing leads", done: "Imported leads" },
  batch_create_leads: { doing: "Importing leads", done: "Imported leads" },
  generate_proposal: { doing: "Drafting the proposal", done: "Drafted the proposal" },
  search_web: { doing: "Searching the web", done: "Searched the web" },
  spawn_subagent: { doing: "Starting a helper agent", done: "Helper agent finished" },
  get_blog_posts_stats: { doing: "Reading blog posts", done: "Read blog posts" },
  send_blog_to_subscribers: { doing: "Sending the newsletter", done: "Sent the newsletter" },
  query_wish_game_data: { doing: "Reading wish game data", done: "Read wish game data" },
  get_admin_users: { doing: "Reading users", done: "Read users" },
  get_admin_agreements: { doing: "Reading agreements", done: "Read agreements" },
  get_admin_projects: { doing: "Reading projects", done: "Read projects" },
  get_daily_brief: { doing: "Checking what needs you", done: "Checked what needs you" },
  get_billing_overview: { doing: "Checking billing", done: "Checked billing" },
  list_consulting_invoices: { doing: "Reading invoices", done: "Read invoices" },
  list_consulting_payments: { doing: "Reading payments", done: "Read payments" },
  issue_consulting_invoice: { doing: "Preparing the invoice for approval", done: "Invoice ready for approval" },
  decide_consulting_payment: { doing: "Preparing the payment for approval", done: "Payment ready for approval" },
  create_milestone_invoice: { doing: "Preparing the invoice for approval", done: "Invoice ready for approval" },
  create_artifact: { doing: "Creating the file", done: "Created the file" },
  list_delivery_projects: { doing: "Reading projects", done: "Read projects" },
  list_project_tasks: { doing: "Reading the board", done: "Read the board" },
  list_sprints: { doing: "Reading sprints", done: "Read sprints" },
  get_team_workload: { doing: "Checking team workload", done: "Checked team workload" },
  list_change_requests: { doing: "Reading change requests", done: "Read change requests" },
  move_task: { doing: "Preparing the task move for approval", done: "Task move ready for approval" },
  change_sprint: { doing: "Preparing the sprint change for approval", done: "Sprint change ready for approval" },
  list_discovery_meetings: { doing: "Reading discovery meetings", done: "Read discovery meetings" },
  list_proposals: { doing: "Reading proposals", done: "Read proposals" },
  list_assessments: { doing: "Reading assessments", done: "Read assessments" },
};

const sentence = (name: string) => {
  const words = name.replaceAll("_", " ").trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : "Working";
};

export function toolLabel(name: string, state: "doing" | "done"): string {
  return LABELS[name]?.[state] ?? sentence(name);
}
