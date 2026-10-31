"use client";

import { FormEvent, ReactNode, useState } from "react";
import { Alert, Button, Checkbox, CopyButton, Input, Modal, Select } from "@/src/components/ui";
import { FormField } from "@/src/components/patterns";
import { type IssuedKey, PERMISSIONS, READ_ONLY_PERMISSIONS } from "./api";

/* ── Raw key, shown once ──────────────────────────────────────────── */

export function IssuedKeyModal({ issued, onClose }: { issued: IssuedKey | null; onClose: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const close = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <Modal
      open={issued !== null}
      // Closing is only allowed once staff confirm they copied the key.
      onOpenChange={(open) => { if (!open && confirmed) close(); }}
      title="Copy this API key now"
      description={issued ? `${issued.key.name} · ${issued.key.keyPrefix}…` : undefined}
      footer={<Button variant="primary" disabled={!confirmed} onClick={close}>Done</Button>}
    >
      {issued && (
        <div className="flex flex-col gap-4">
          <Alert variant="warning" title="This is the only time the full key is shown">
            Growx Location stores only a hash. If it is lost, rotate the key to issue a new one.
          </Alert>
          <div className="flex items-center gap-2">
            <code className="ds-t-mono min-w-0 flex-1 break-all rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-canvas)] px-3 py-2 text-[var(--text-primary)]">
              {issued.rawKey}
            </code>
            <CopyButton value={issued.rawKey} label="Copy key" size={32} />
          </div>
          {issued.previousKey && (
            <p className="ds-t-meta text-[var(--text-muted)]">
              {issued.previousKey.status === "revoked"
                ? "The previous key was revoked immediately."
                : `The previous key keeps working until ${new Date(issued.previousKey.expiresAt ?? "").toLocaleString()}.`}
            </p>
          )}
          <Checkbox checked={confirmed} onCheckedChange={setConfirmed} label="I have copied the key and stored it safely" />
        </div>
      )}
    </Modal>
  );
}

/* ── Create key ───────────────────────────────────────────────────── */

export type CreateKeyInput = { name: string; permissions: string[]; expiresAt?: string };

export function CreateKeyModal({
  open,
  onOpenChange,
  onSubmit,
  submitting,
  error,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateKeyInput) => void;
  submitting: boolean;
  error?: string | null;
}) {
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<string[]>(READ_ONLY_PERMISSIONS);
  const [expiresOn, setExpiresOn] = useState("");

  const toggle = (value: string, checked: boolean) =>
    setPermissions((current) => (checked ? [...new Set([...current, value])] : current.filter((p) => p !== value)));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({
      name: name.trim(),
      permissions,
      // End of the chosen day, local time.
      expiresAt: expiresOn ? new Date(`${expiresOn}T23:59:59`).toISOString() : undefined,
    });
  };

  const reset = (next: boolean) => {
    if (!next) {
      setName("");
      setPermissions(READ_ONLY_PERMISSIONS);
      setExpiresOn("");
    }
    onOpenChange(next);
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <Modal
      open={open}
      onOpenChange={reset}
      title="New API key"
      description="The client uses this key from their server. Grant only what they need."
      footer={
        <>
          <Button variant="secondary" onClick={() => reset(false)}>Cancel</Button>
          <Button variant="primary" type="submit" form="create-location-key" loading={submitting} disabled={!name.trim() || permissions.length === 0}>
            Create key
          </Button>
        </>
      }
    >
      <form id="create-location-key" onSubmit={submit} className="flex flex-col gap-4">
        {error && <Alert variant="danger">{error}</Alert>}
        <FormField label="Key name" hint="Where it is used, for example “Production website”." required>
          {(field) => <Input {...field} value={name} maxLength={200} onChange={(e) => setName(e.target.value)} autoFocus />}
        </FormField>
        <fieldset className="flex flex-col gap-2">
          <legend className="ds-t-label mb-1 text-[var(--text-primary)]">Permissions</legend>
          {PERMISSIONS.map((permission) => (
            <Checkbox
              key={permission.value}
              checked={permissions.includes(permission.value)}
              onCheckedChange={(checked) => toggle(permission.value, checked)}
              label={permission.label}
              description={permission.description}
            />
          ))}
        </fieldset>
        <FormField label="Expires on" hint="Optional. Leave empty for a key that does not expire.">
          {(field) => <Input {...field} type="date" min={today} value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)} />}
        </FormField>
      </form>
    </Modal>
  );
}

/* ── Rotate key ───────────────────────────────────────────────────── */

const GRACE_OPTIONS = [
  { value: "0", label: "Revoke the old key now" },
  { value: "1", label: "1 hour" },
  { value: "24", label: "24 hours" },
  { value: "72", label: "3 days" },
  { value: "168", label: "7 days" },
];

export function RotateKeyModal({
  keyName,
  open,
  onOpenChange,
  onConfirm,
  submitting,
  error,
}: {
  keyName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (graceHours: number) => void;
  submitting: boolean;
  error?: string | null;
}) {
  const [grace, setGrace] = useState("24");

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={`Rotate “${keyName}”`}
      description="Issues a new key with the same permissions. The old key keeps working during the grace period so the client can switch without downtime."
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="primary" loading={submitting} onClick={() => onConfirm(Number(grace))}>Rotate key</Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        {error && <Alert variant="danger">{error}</Alert>}
        <FormField label="Old key keeps working for">
          {(field) => <Select id={field.id} aria-describedby={field["aria-describedby"]} options={GRACE_OPTIONS} value={grace} onValueChange={setGrace} />}
        </FormField>
      </div>
    </Modal>
  );
}

/* ── Generic confirm ──────────────────────────────────────────────── */

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  children,
  confirmLabel,
  destructive,
  onConfirm,
  submitting,
  error,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  submitting: boolean;
  error?: string | null;
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant={destructive ? "danger" : "primary"} loading={submitting} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="ds-t-body text-[var(--text-secondary)]">{children}</div>
      </div>
    </Modal>
  );
}
