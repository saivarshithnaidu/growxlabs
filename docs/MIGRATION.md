# Admin UI migration

Moving every `/admin` page onto the component library in `src/components/ui` (primitives) and
`src/components/patterns` (page patterns). Preview of every component: `/admin/design`.

**Rules:** UI only. Data fetching, actions, routes, permissions and business logic stay exactly as they are.
Tokens only (no hex colors, fonts, radius, shadows or arbitrary Tailwind values in pages); pages compose
library components and add layout only. If a page needs a logic change or fits no pattern, stop and ask.

**Per module:** migrate → typecheck → render-check every page → tick the checklist → summary → wait for review.

## Status

- [x] Library + `/admin/design` preview (approved)
- [x] Live admin shell on the library `AppShell` (`components/ds` deleted; nav config moved to `lib/admin-nav.ts`)
- [ ] Customer & Sales — rebuilt and typechecked; visual render check pending (browser pane not signed in)
- [ ] Consulting Workflow
- [ ] Projects & Delivery
- [ ] Finance & Accounts
- [ ] People Operations
- [ ] Growth & Marketing
- [ ] Customer Support
- [ ] Learning & Commerce
- [ ] Administration
- [ ] Operations & Audit
- [ ] Overview
- [ ] Remove legacy styles (`app/admin/admin-typography.css` overrides, `!important` rules) and unused components

## Page checklist

Tick when the page is rebuilt on the library, has no hardcoded styles, typechecks and was render-checked.
`[~]` = rebuilt, no hardcoded styles, typechecks, compiles on the dev server (HTTP 200); visual check still pending.

### Customer & Sales
- [~] `/admin/crm`
- [~] `/admin/crm/sources`
- [~] `/admin/crm/team`
- [~] `/admin/leads`
- [~] `/admin/leads/[id]`
- [~] `/admin/leads/imports`
- [~] `/admin/leads/imports/[batchId]`
- [~] `/admin/deals`
- [~] `/admin/companies`
- [~] `/admin/contacts`
- [~] `/admin/quotations`
- [~] `/admin/proposals`
- [~] `/admin/proposals/[proposalId]`
- [~] `/admin/products`

Later modules get their own checklist when their migration starts; the inventory below lists every page.

## Business components

Built when the first page needs one, added to `/admin/design`, then reused.

| Component | First needed by | Status |
|---|---|---|
| CurrencyAmount | `/admin/deals`, `/admin/quotations`, `/admin/products` | done (`ui/Format`, with RelativeTime) |
| FileUpload | `/admin/leads`, `/admin/crm` (CSV import) | done (`business/FileUpload`) |
| ActivityTimeline | `/admin/companies` (Customer360) | done (`business/ActivityTimeline`) |
| LineItemsEditor | `/admin/quotations` | done (`business/LineItemsEditor`, with TotalsSummary) |
| KanbanBoard | `/admin/deals` | done (`patterns/Kanban`, now with drag hooks) |
| Combobox | `/admin/quotations` | done (`ui/Combobox`) |
| ChartCard | — | not needed yet: no Customer & Sales page has charts. First real user: `/admin/finance/dashboard` |
| NotesAndComments | — | not needed yet: lead notes are a single textarea, not a thread. First real user: `/admin/support` |
| DocumentPreview | — | not needed yet: `/admin/proposals/[id]` keeps `ProposalDocument` as the preview body |
| DateRangePicker | — | not needed yet: `/admin/crm/team` uses a period select. First real user: `/admin/finance/reports` |
| PermissionGate | `/admin/people/access`, `/admin/clients` | todo |
| AuditLogViewer | `/admin/audit-logs`, `/admin/activity` | todo |

Also added to the library while migrating Customer & Sales (all on `/admin/design`):
`ui/Alert`, `ui/CopyButton`, `ui/FilterSelect` (+ `FilterChip.menuContent`), `ui/Format` (CurrencyAmount, RelativeTime),
`patterns/LoadingState`, `business/LeadScore`, `business/StageStepper`, StatusBadge domains `import` and `proposal`,
DataTable `sortable` column flag, Pagination rows-per-page, one `ToastViewport` in the admin layout.

## Open questions (need a decision before those pages move)

1. **Excluded pages.** Dark full-screen workspaces with no shell (`/admin/command-center` and its governance pages, `/admin/editorial-carousel`, `/admin/instagram-carousel`, `/admin/reels-creator`), print-render routes and the client-facing onboarding preview. Plan: leave them as they are.
2. **Pages with no matching pattern.** AI assistants (`/admin/pm/ai-copilot`, `/admin/finance/ai-helper`, `/admin/hrms/ai-recruiter`), editors and tools (`/admin/career-portal`, `/admin/resumeforge`, `/admin/pitch-deck`, `/admin/workflows`, `/admin/growx-email`, `/admin/employee-onboarding`). Each needs a pattern decision, such as a new `AssistantPage` or `EditorPage`.
3. **Nav problems.** `/admin/proposal-approvals` is in the nav but has no route (404). `/admin/projects` and `/admin/consulting-finance` appear in two modules, so the rail highlights the first module that lists them. "AI Lead Scraper" (`/admin/leads/scrape`) redirects to Leads.
4. **Documents.** Document bodies (proposal, MSA, invoice template, assessment) are exported or printed, so only the page chrome around them moves to the library.

## Inventory

All 127 routes under `app/admin`, plus the missing nav route. "Today" counts include directly delegated
components: total lines · hardcoded hex colors · arbitrary Tailwind values (`x-[…]`) · legacy UI imports
(`components/ui`, `components/ds`, `framer-motion`, `recharts`, `sonner`).

Patterns: **ListPage**, **DetailPage**, **FormPage**, **Dashboard**, **Kanban**, **Settings**, **Documents**;
also **Redirect**, **Excluded**, **Unclear** (ask), **Missing**, **Done**.

### Overview

| Route | Pattern | Needs | Today (lines · hex · arbitrary · legacy imports) | Notes |
|---|---|---|---|---|
| `/admin` | Dashboard | DashboardGrid, KPIStrip, ChartCard, DataTable, Timeline | 549 · 68 · 158<br>→ marketing/Reveal.tsx |  |
| `/admin/command-center` | Excluded | — | 27 · 0 · 0<br>→ app/admin/command-center/InteractiveWorkspace.tsx | Dark full-screen workspace rendered without the shell. Ask before touching. |
| `/admin/command-center/governance` | Redirect | — | 6 · 0 · 0 | Redirects to /approvals. |
| `/admin/command-center/governance/approvals` | ListPage | DataTable, StatusBadge, Drawer | 399 · 0 · 11<br>→ app/admin/command-center/governance/approvals/approval-inbox.tsx | Inside the dark command-center shell. Ask. |
| `/admin/command-center/governance/audit` | ListPage | AuditLogViewer | 371 · 0 · 17<br>→ app/admin/command-center/governance/audit/audit-viewer.tsx | Inside the dark command-center shell. Ask. |
| `/admin/command-center/governance/policies` | Settings | SettingsLayout, Switch, FormField | 268 · 0 · 9<br>→ app/admin/command-center/governance/policies/policy-console.tsx | Inside the dark command-center shell. Ask. |

### Customer & Sales

| Route | Pattern | Needs | Today (lines · hex · arbitrary · legacy imports) | Notes |
|---|---|---|---|---|
| `/admin/crm` | Dashboard | DashboardGrid, KPIStrip, ChartCard, CurrencyAmount, DataTable, Timeline | 1442 · 277 · 432 · ui/Button, framer-motion<br>→ marketing/Reveal.tsx |  |
| `/admin/crm/sources` | ListPage | DataTable, Badge | 127 · 0 · 55 · ui/Button<br>→ marketing/Reveal.tsx | Not in nav; reached from CRM Hub. |
| `/admin/crm/team` | Dashboard | KPIStrip, DataTable, Avatar, FilterChip | 21 · 9 · 52<br>→ admin/crm/AdminSalesTeam.tsx |  |
| `/admin/leads` | ListPage | DataTable, Toolbar, FilterChip, StatusBadge, Modal, FileUpload | 1233 · 50 · 337 · ui/Button, ui/Textarea, framer-motion |  |
| `/admin/leads/[id]` | DetailPage | Tabs, KeyValueList, ActivityTimeline, NotesAndComments, StatusBadge | 1141 · 36 · 270 · ui/Button, framer-motion<br>→ admin/crm/AdminLeadAssignment.tsx, admin/crm/AdminLeadSalesContext.tsx |  |
| `/admin/leads/imports` | ListPage | DataTable, EmptyState, StatusBadge | 126 · 0 · 17 · ds/PageHeader, ds/Button, ds/Badge | Polished in the shell pass on components/ds; move to library. |
| `/admin/leads/imports/[batchId]` | DetailPage | KPIStrip, DataTable, StatusBadge | 163 · 3 · 16 |  |
| `/admin/leads/scrape` | Redirect | — | 6 · 0 · 0 | Redirects to /admin/leads (nav item 'AI Lead Scraper' points here). |
| `/admin/deals` | Kanban | KanbanBoard, KanbanCard, CurrencyAmount, Modal | 365 · 25 · 49 · ui/Button, ui/Card, ui/Input, framer-motion<br>→ admin/KanbanBoard.tsx | Uses legacy components/admin/KanbanBoard. |
| `/admin/companies` | ListPage | DataTable, Drawer/DetailPage (Customer360) | 522 · 54 · 88 · ui/Card, ui/Button, ui/Input<br>→ admin/Customer360.tsx |  |
| `/admin/contacts` | ListPage | DataTable, Modal, FormField | 221 · 17 · 30 · ui/Card, ui/Button, ui/Input |  |
| `/admin/quotations` | FormPage | LineItemsEditor, CurrencyAmount, DocumentPreview | 477 · 21 · 91 · ui/Card, ui/Button, ui/Input<br>→ admin/QuoteGenerator.tsx | QuoteGenerator builds a quote + PDF. |
| `/admin/proposals` | ListPage | DataTable, StatusBadge | 172 · 0 · 2 |  |
| `/admin/proposals/[proposalId]` | Documents | DocumentPreview, PageHeader actions | 508 · 2 · 8<br>→ proposal/ProposalDocument.tsx | Proposal document body must stay unchanged (exported). |
| `/admin/products` | ListPage | DataTable, Modal, FormField, CurrencyAmount | 184 · 17 · 29 · ui/Card, ui/Button, ui/Input |  |

### Consulting Workflow

| Route | Pattern | Needs | Today (lines · hex · arbitrary · legacy imports) | Notes |
|---|---|---|---|---|
| `/admin/assessments` | ListPage | DataTable, StatusBadge | 7 · 1 · 2<br>→ admin/assessments/AssessmentAdminList.tsx |  |
| `/admin/assessments/[assessmentId]` | Documents | DocumentPreview | 33 · 2 · 2<br>→ admin/assessments/AdminDocumentActions.tsx, assessment/AssessmentDocumentPage.tsx | Document body preserved. |
| `/admin/assessments/[assessmentId]/pdf-render` | Excluded | — | 280 · 3 · 10<br>→ assessment/AssessmentDocument.tsx | Print/PDF render route, no shell. |
| `/admin/audits` | ListPage | DataTable | 10 · 2 · 2<br>→ admin/audits/AuditList.tsx |  |
| `/admin/audits/new` | FormPage | FormSection, FormField | 71 · 1 · 1 |  |
| `/admin/audits/[auditId]` | DetailPage | Tabs, KeyValueList | 7 · 2 · 2<br>→ admin/audits/AuditWorkspace.tsx |  |
| `/admin/discovery-meetings` | ListPage | DataTable | 137 · 12 · 15 · ui/Card, ui/Button<br>→ admin/discovery/DiscoveryMeetingsClient.tsx |  |
| `/admin/discovery-meetings/new` | FormPage | FormField | 5 · 1 · 1 |  |
| `/admin/discovery-meetings/[meetingId]` | DetailPage | Tabs, NotesAndComments | 324 · 41 · 57 · ui/Card, ui/Button<br>→ admin/discovery/DiscoveryMeetingWorkspace.tsx |  |
| `/admin/ai-solution-reports` | ListPage | DataTable | 12 · 1 · 1<br>→ admin/consulting/ConsultingList.tsx |  |
| `/admin/ai-solution-reports/[reportId]` | Documents | DocumentPreview | 271 · 8 · 8<br>→ admin/consulting/ConsultingWorkspace.tsx |  |
| `/admin/solution-architectures` | ListPage | DataTable | 12 · 1 · 1<br>→ admin/consulting/ConsultingList.tsx |  |
| `/admin/solution-architectures/[architectureId]` | Documents | DocumentPreview | 271 · 8 · 8<br>→ admin/consulting/ConsultingWorkspace.tsx |  |
| `/admin/scopes` | ListPage | DataTable | 132 · 0 · 2 |  |
| `/admin/scopes/[scopeId]` | Documents | DocumentPreview, FormField | 29 · 8 · 14<br>→ consulting/ScopeOfWorkDocument.tsx |  |
| `/admin/proposal-approvals` | Missing | — | — | In nav, but no route exists (404). |
| `/admin/agreements` | ListPage | DataTable, StatusBadge | 52 · 2 · 4 |  |
| `/admin/agreements/[id]` | Documents | DocumentPreview | 179 · 18 · 29<br>→ commercial/MasterServiceAgreementDocument.tsx |  |
| `/admin/agreements/preview` | Redirect | — | 4 · 0 · 0 |  |
| `/admin/contractor-agreements` | ListPage | DataTable | 54 · 3 · 5 |  |
| `/admin/contractor-agreements/[id]` | Documents | DocumentPreview | 124 · 8 · 13<br>→ contractors/ContractorAgreementDocument.tsx |  |
| `/admin/onboarding` | ListPage | DataTable, StatusBadge | 292 · 5 · 8<br>→ admin/onboarding/OnboardingAdminWorkspace.tsx |  |
| `/admin/onboarding/[onboardingId]` | DetailPage | Tabs, Timeline | 292 · 5 · 8<br>→ admin/onboarding/OnboardingAdminWorkspace.tsx |  |
| `/admin/onboarding/preview` | Excluded | — | 221 · 57 · 1<br>→ onboarding/OnboardingFlow.tsx | Preview of the client-facing onboarding flow. |
| `/admin/projects` | ListPage | DataTable | 175 · 7 · 9<br>→ admin/delivery/ProjectWorkspaceList.tsx | Also listed under Projects & Delivery (duplicate nav href). |
| `/admin/projects/[projectId]` | DetailPage | Tabs, Timeline, KeyValueList | 234 · 10 · 18<br>→ admin/delivery/ProjectWorkspaceDetail.tsx |  |
| `/admin/consulting-finance` | ListPage | KPIStrip, DataTable, CurrencyAmount | 22 · 5 · 7 | Also listed under Finance (duplicate nav href). |

### Projects & Delivery

| Route | Pattern | Needs | Today (lines · hex · arbitrary · legacy imports) | Notes |
|---|---|---|---|---|
| `/admin/pm/projects` | ListPage | DataTable, Modal | 172 · 20 · 29 · ui/Card, ui/Button |  |
| `/admin/pm/projects/[id]` | DetailPage | Tabs, KanbanBoard (AgileKanban) | 1206 · 81 · 120 · ui/Card<br>→ admin/pm/AgileKanban.tsx, admin/pm/PMIcons.tsx |  |
| `/admin/change-requests` | ListPage | DataTable, StatusBadge | 10 · 1 · 1 |  |
| `/admin/pm/sprints` | ListPage | DataTable, KPIItem, ChartCard | 211 · 20 · 28 · ui/Card, ui/Button<br>→ admin/pm/SprintManager.tsx |  |
| `/admin/pm/workload` | Dashboard | DashboardGrid, ChartCard | 159 · 11 · 15 · ui/Card<br>→ admin/pm/WorkloadBalancer.tsx |  |
| `/admin/pm/timesheets` | ListPage | DataTable, Modal, DateRangePicker | 339 · 26 · 36 · ui/Card, ui/Button, ui/Input<br>→ admin/pm/TimeTracker.tsx |  |
| `/admin/pm/bugs` | ListPage | DataTable, StatusBadge, Modal | 203 · 19 · 28 · ui/Card, ui/Button, ui/Input |  |
| `/admin/pm/ai-copilot` | Unclear | — | 118 · 20 · 25 · ui/Card, ui/Button | AI assistant/chat UI; no matching pattern. Ask. |

### Finance & Accounts

| Route | Pattern | Needs | Today (lines · hex · arbitrary · legacy imports) | Notes |
|---|---|---|---|---|
| `/admin/finance/dashboard` | Dashboard | KPIStrip, ChartCard, CurrencyAmount | 203 · 16 · 32 · ui/Card<br>→ admin/finance/FinanceDashboard.tsx |  |
| `/admin/finance/reports` | Dashboard | ChartCard, DataTable, DateRangePicker | 244 · 30 · 40 · ui/Card |  |
| `/admin/finance/invoices` | FormPage | LineItemsEditor, CurrencyAmount, DocumentPreview | 510 · 43 · 62 · ui/Card, ui/Button, ui/Input<br>→ admin/finance/InvoiceBuilder.tsx | InvoiceBuilder. |
| `/admin/invoices` | ListPage | DataTable, StatusBadge, CurrencyAmount, Modal | 1141 · 26 · 223 · ui/Button, ui/Card, framer-motion |  |
| `/admin/invoices/[id]` | Documents | DocumentPreview | 369 · 20 · 61<br>→ admin/InvoiceTemplate.tsx | InvoiceTemplate body preserved. |
| `/admin/invoices/preview` | Documents | DocumentPreview | 329 · 20 · 59<br>→ admin/InvoiceTemplate.tsx | Mock-data preview, not in nav. |
| `/admin/finance/expenses` | ListPage | DataTable, Modal, CurrencyAmount, FileUpload | 171 · 16 · 24 · ui/Card, ui/Button, ui/Input |  |
| `/admin/finance/accounts` | ListPage | DataTable, CurrencyAmount | 316 · 27 · 40 · ui/Card, ui/Button, ui/Input<br>→ admin/finance/GeneralLedger.tsx | General ledger. |
| `/admin/finance/ai-helper` | Unclear | — | 166 · 19 · 25 · ui/Card, ui/Button, ui/Input | AI assistant UI. Ask. |

### People Operations

| Route | Pattern | Needs | Today (lines · hex · arbitrary · legacy imports) | Notes |
|---|---|---|---|---|
| `/admin/hrms/dashboard` | Dashboard | KPIStrip, ChartCard | 242 · 7 · 76 · ui/Card<br>→ admin/hrms/HrmsDashboard.tsx |  |
| `/admin/people` | ListPage | DataTable, Avatar | 184 · 18 · 104<br>→ admin/people/PeopleDirectory.tsx |  |
| `/admin/people/team` | ListPage | DataTable, Avatar | 9 · 3 · 14<br>→ admin/people/TeamWorkspace.tsx |  |
| `/admin/hrms/employees` | ListPage | DataTable, Avatar | 166 · 8 · 55 · ui/Card |  |
| `/admin/people/departments` | ListPage | DataTable, Modal | 82 · 5 · 40<br>→ admin/people/StructureWorkspace.tsx |  |
| `/admin/people/designations` | ListPage | DataTable, Modal | 82 · 5 · 40<br>→ admin/people/StructureWorkspace.tsx |  |
| `/admin/recruitment` | ListPage | DataTable, Drawer | 386 · 10 · 62<br>→ admin/recruitment/RecruiterWorkspace.tsx |  |
| `/admin/recruitment/operations` | Dashboard | KPIStrip, DataTable | 348 · 13 · 21<br>→ admin/recruitment/HiringOperations.tsx |  |
| `/admin/recruitment/manager` | ListPage | DataTable | 60 · 3 · 17<br>→ admin/recruitment/HiringManagerWorkspace.tsx |  |
| `/admin/hrms/recruitment` | Kanban | KanbanBoard, Drawer | 1196 · 20 · 181 · ui/Card<br>→ admin/hrms/RecruitmentPipeline.tsx | RecruitmentPipeline. |
| `/admin/hrms/recruitment/interviews` | ListPage | DataTable, DateRangePicker | 463 · 13 · 113 · ui/Card |  |
| `/admin/hrms/recruitment/interviews/[interviewId]` | DetailPage | KeyValueList, Timeline | 191 · 6 · 44 · ui/Card |  |
| `/admin/hrms/recruitment/interviews/[interviewId]/access` | Settings | FormField, Switch | 345 · 13 · 83 · ui/Card |  |
| `/admin/offers` | ListPage | DataTable, Drawer, DocumentPreview | 891 · 8 · 37<br>→ admin/onboarding/OfferWorkspace.tsx |  |
| `/admin/career-portal` | Unclear | — | 979 · 1 · 127 · framer-motion<br>→ marketing/Reveal.tsx | Large marketing-style editor (framer-motion). Ask. |
| `/admin/career-portal/playbook` | Documents | — | 344 · 0 · 12<br>→ marketing/Reveal.tsx | Static playbook content. |
| `/admin/resumeforge` | Unclear | — | 1099 · 46 · 72 · ui/Card, ui/Button, ui/Input, ui/Skeleton<br>→ admin/AdminSkeletons.tsx | Resume tool/editor. Ask. |
| `/admin/hrms/ai-recruiter` | Unclear | — | 230 · 9 · 76 · ui/Card | AI assistant UI. Ask. |
| `/admin/hrms/recruitment/emails` | ListPage | DataTable, StatusBadge | 326 · 13 · 76 |  |
| `/admin/hrms/recruitment/email-templates` | ListPage | DataTable, Drawer, FormField | 272 · 14 · 52 |  |
| `/admin/hrms/recruitment/email-settings` | Settings | SettingsLayout, FormField | 281 · 16 · 70 |  |
| `/admin/hr-onboarding` | ListPage | DataTable, Timeline | 16 · 5 · 23<br>→ admin/onboarding/OnboardingWorkspace.tsx | OnboardingWorkspace scope=hr. |
| `/admin/hr-onboarding/manager` | ListPage | DataTable, Timeline | 16 · 5 · 23<br>→ admin/onboarding/OnboardingWorkspace.tsx | OnboardingWorkspace scope=manager. |
| `/admin/employee-onboarding` | Unclear | — | 1062 · 190 · 202 · framer-motion | 1,000-line onboarding wizard. Ask. |
| `/admin/hrms/attendance` | ListPage | DataTable, DateRangePicker | 248 · 6 · 71 · ui/Card<br>→ admin/hrms/AttendanceTracker.tsx |  |
| `/admin/hrms/leaves` | ListPage | DataTable, StatusBadge | 199 · 11 · 87 · ui/Card |  |
| `/admin/hrms/payroll` | Dashboard | Tabs, DataTable, CurrencyAmount | 275 · 0 · 7<br>→ payroll/PayrollProcessingStudio.tsx, payroll/ReimbursementConsole.tsx, payroll/AIPayrollAssistant.tsx | Not in nav. |
| `/admin/people/access` | Settings | PermissionGate, DataTable, Switch | 12 · 5 · 32<br>→ admin/people/AccessWorkspace.tsx |  |
| `/admin/attendance-leave` | ListPage | DataTable, Tabs | 10 · 2 · 4<br>→ admin/hrms/AttendanceLeaveConsole.tsx | Not in nav. |
| `/admin/hrms/learning` | Dashboard | Tabs | 248 · 0 · 7<br>→ learning/LMSCourseLibrary.tsx, learning/InternalMobilityPortal.tsx, learning/AILearningAssistant.tsx | Not in nav. |
| `/admin/hrms/performance` | Dashboard | Tabs | 382 · 0 · 8<br>→ performance/GoalManagementConsole.tsx, performance/ReviewCycleConsole.tsx, performance/CalibrationStudio.tsx, performance/AIPerformanceAssistant.tsx | Not in nav. |
| `/admin/hrms/platform` | Dashboard | Tabs | 230 · 0 · 7<br>→ platform/WorkflowBuilderConsole.tsx, platform/IntegrationHubConsole.tsx, platform/ExecutiveCommandCenter.tsx | Not in nav. |
| `/admin/hrms/workforce` | Dashboard | Tabs | 241 · 0 · 6<br>→ workforce/HelpdeskPortalConsole.tsx, workforce/TravelManagementConsole.tsx, workforce/AIWorkforceAssistant.tsx | Not in nav. |

### Growth & Marketing

| Route | Pattern | Needs | Today (lines · hex · arbitrary · legacy imports) | Notes |
|---|---|---|---|---|
| `/admin/marketing` | Dashboard | DashboardGrid, KPIStrip, DataTable | 735 · 0 · 34 · ui/Button, ui/Input, ui/Card, sonner, framer-motion |  |
| `/admin/outreach` | ListPage | DataTable | 36 · 0 · 1 · ui/Card, ui/Button, framer-motion |  |
| `/admin/dispatch` | ListPage | DataTable, Drawer, FormField | 986 · 51 · 204 · framer-motion<br>→ app/admin/dispatch/DispatchAdminClient.tsx |  |
| `/admin/growx-email` | Unclear | — | 590 · 0 · 16 · ui/Card, ui/Button, framer-motion<br>→ marketing/Reveal.tsx | Email client (three-pane). Ask. |
| `/admin/communications` | ListPage | DataTable, Tabs | 12 · 0 · 1<br>→ admin/communications/CommunicationWorkspace.tsx |  |
| `/admin/editorial-carousel` | Excluded | — | 5563 · 128 · 130 · sonner<br>→ shared/EditorialCarouselClient.tsx | Dark creative studio rendered without the shell. |
| `/admin/pitch-deck` | Unclear | — | 1028 · 1 · 52 · ui/Card, ui/Button, framer-motion<br>→ marketing/Reveal.tsx | Presentation builder/editor. Ask. |
| `/admin/instagram-carousel` | Excluded | — | 3648 · 383 · 173 · ui/Button, sonner<br>→ shared/CarouselGeneratorClient.tsx | Creative studio, not in nav. |
| `/admin/reels-creator` | Excluded | — | 1637 · 155 · 88 · sonner<br>→ shared/ReelsGeneratorClient.tsx | Creative studio, not in nav. |

### Customer Support

| Route | Pattern | Needs | Today (lines · hex · arbitrary · legacy imports) | Notes |
|---|---|---|---|---|
| `/admin/support` | ListPage | DataTable, Drawer, NotesAndComments, StatusBadge | 747 · 60 · 102 · ui/Button, ui/Input, ui/Card, sonner, framer-motion | Ticket list + detail. |

### Learning & Commerce

| Route | Pattern | Needs | Today (lines · hex · arbitrary · legacy imports) | Notes |
|---|---|---|---|---|
| `/admin/academy/courses` | ListPage | DataTable, Modal | 131 · 0 · 4 · ui/Button |  |
| `/admin/academy/assessments` | ListPage | DataTable | 136 · 0 · 1 · ui/Button |  |
| `/admin/academy/users` | ListPage | DataTable, Avatar | 135 · 0 · 1 · ui/Button |  |
| `/admin/academy/certificates` | ListPage | DataTable | 135 · 0 · 0 · ui/Button |  |
| `/admin/academy/payments` | ListPage | DataTable, CurrencyAmount | 100 · 0 · 3 | Not in nav. |
| `/admin/certificates/new` | FormPage | FormSection, FormField | 120 · 2 · 2 · ui/Button, ui/Input, ui/Card, sonner | Not in nav. |
| `/admin/monetization/coupons` | ListPage | DataTable, Modal, FormField | 327 · 3 · 8 · ui/Button, ui/Input, sonner, framer-motion<br>→ admin/CouponManagementClient.tsx |  |
| `/admin/monetization/orders` | ListPage | DataTable, CurrencyAmount, StatusBadge | 141 · 0 · 0 · ui/Button |  |

### Administration

| Route | Pattern | Needs | Today (lines · hex · arbitrary · legacy imports) | Notes |
|---|---|---|---|---|
| `/admin/settings` | Settings | SettingsLayout, FormField, Switch | 731 · 77 · 98 · ui/Button, sonner<br>→ providers/AccentColorProvider.tsx |  |
| `/admin/settings/terms` | FormPage | FormField, Textarea | 127 · 0 · 19 · ui/Button<br>→ marketing/Reveal.tsx | Not in nav. |
| `/admin/reports` | Dashboard | ChartCard, DateRangePicker | 159 · 20 · 30 · ui/Card |  |
| `/admin/workflows` | Unclear | — | 337 · 30 · 42 · ui/Card, ui/Button, ui/Input<br>→ admin/AutomationBuilder.tsx | Automation builder canvas. Ask. |
| `/admin/clients` | ListPage | DataTable, Drawer, PermissionGate | 776 · 126 · 178 |  |
| `/admin/search` | ListPage | SearchInput, DataTable | 190 · 1 · 16 · ui/Card, ui/Button, ui/Input, framer-motion | Global search results, not in nav. |
| `/admin/design` | Done | — | 739 · 0 · 59<br>→ app/admin/design/_preview/Primitives.tsx, app/admin/design/_preview/DataShell.tsx, app/admin/design/_preview/PatternsDemo.tsx | Component preview. |
| `/admin/ai-platform` | Redirect | — | 20 · 0 · 2 | Client-side redirect. |
| `/admin/wish-game` | Excluded | — | 979 · 103 · 128<br>→ app/admin/wish-game/WishAdminDashboardClient.tsx | Campaign mini-app, not in nav. Ask. |

### Operations & Audit

| Route | Pattern | Needs | Today (lines · hex · arbitrary · legacy imports) | Notes |
|---|---|---|---|---|
| `/admin/activity` | ListPage | AuditLogViewer / ActivityTimeline | 4 · 0 · 0 |  |
| `/admin/audit-logs` | ListPage | AuditLogViewer | 4 · 0 · 0 |  |
| `/admin/system/errors` | ListPage | DataTable, StatusBadge | 4 · 0 · 0 |  |
