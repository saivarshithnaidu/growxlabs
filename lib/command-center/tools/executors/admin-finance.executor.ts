import { supabaseAdmin } from "@/lib/supabase/admin";
import { ToolExecutor } from "../registry/tool-types";
import {
  GetAdminUsersSchema,
  GetAdminAgreementsSchema,
  GetAdminProjectsSchema,
  CreateAdminProjectSchema
} from "../../validation/tool.schemas";
import { z } from "zod";

export const getAdminUsersExecutor: ToolExecutor<z.infer<typeof GetAdminUsersSchema>, unknown> = {
  name: "get_admin_users",
  description: "Retrieve list of registered client users.",
  inputSchema: GetAdminUsersSchema,
  riskLevel: "low",
  requiredPermissions: ["users:read"],
  async execute(input) {
    let query = supabaseAdmin.from("users").select("id, name, email, role, created_at");
    if (input.searchQuery) {
      query = query.or(`name.ilike.%${input.searchQuery}%,email.ilike.%${input.searchQuery}%`);
    }
    const limit = input.limit || 20;
    const { data, error } = await query.order("created_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return data || [];
  }
};

export const getAdminAgreementsExecutor: ToolExecutor<z.infer<typeof GetAdminAgreementsSchema>, unknown> = {
  name: "get_admin_agreements",
  description: "Retrieve a list of client agreements (contracts).",
  inputSchema: GetAdminAgreementsSchema,
  riskLevel: "low",
  requiredPermissions: ["agreements:read"],
  async execute(input) {
    let query = supabaseAdmin.from("agreements").select(`
      id, client_id, service_type, project_description, total_amount, 
      advance_amount, balance_amount, start_date, delivery_date, status, pdf_url, created_at,
      users (id, name, email)
    `);
    if (input.clientId) query = query.eq("client_id", input.clientId);
    const limit = input.limit || 20;
    const { data, error } = await query.order("created_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return data || [];
  }
};



export const getAdminProjectsExecutor: ToolExecutor<z.infer<typeof GetAdminProjectsSchema>, unknown> = {
  name: "get_admin_projects",
  description: "Retrieve a list of client development projects.",
  inputSchema: GetAdminProjectsSchema,
  riskLevel: "low",
  requiredPermissions: ["projects:read"],
  async execute(input) {
    let query = supabaseAdmin.from("projects").select(`
      id, client_id, title, status, progress, created_at,
      users (id, name, email)
    `);
    if (input.clientId) query = query.eq("client_id", input.clientId);
    const limit = input.limit || 20;
    const { data, error } = await query.order("created_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return data || [];
  }
};

export const createAdminProjectExecutor: ToolExecutor<z.infer<typeof CreateAdminProjectSchema>, unknown> = {
  name: "create_admin_project",
  description: "Create and persist a new development project milestone.",
  inputSchema: CreateAdminProjectSchema,
  riskLevel: "high",
  requiredPermissions: ["projects:write"],
  async execute(input) {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert([{
        client_id: input.clientId,
        title: input.title,
        status: input.status || "pending",
        progress: input.progress || 0
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

