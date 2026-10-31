import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui";
import { AuditList } from "@/components/admin/audits/AuditList";
export default function AuditsPage(){return <main className="p-6 md:p-10"><header className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-[var(--text-muted)]">Consulting deliverables</p><h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">Business & technical audits</h1><p className="mt-2 text-sm text-[var(--text-secondary)]">Prepare, review and share the formal audit after Discovery is closed.</p></div><Button asChild variant="primary"><Link href="/admin/audits/new"><Plus size={16} strokeWidth={1.5}/>Create audit</Link></Button></header><AuditList/></main>}
