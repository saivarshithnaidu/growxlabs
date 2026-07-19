import { supabaseAdmin } from "@/lib/supabase/admin";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class BaseRepository<T extends { id: string }> {
  constructor(protected tableName: string) {}

  async findById(id: string): Promise<T | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select("*")
        .eq("id", id)
        .single();
      if (error) return null;
      return data as T;
    } catch (e) {
      return null;
    }
  }

  async findPaginated(
    filters: Record<string, any> = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<T>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    try {
      let query = supabaseAdmin.from(this.tableName).select("*", { count: "exact" });

      if (!options.includeDeleted) {
        // Soft delete filter check
        query = query.or("deleted_at.is.null,deleted_at.eq.null");
      }

      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          query = query.eq(key, val);
        }
      });

      if (options.sortBy) {
        query = query.order(options.sortBy, { ascending: options.sortOrder !== "desc" });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, count, error } = await query.range(offset, offset + limit - 1);

      if (error || !data) {
        return {
          data: [],
          meta: { page, limit, total: 0, totalPages: 0 }
        };
      }

      const total = count || data.length;
      return {
        data: data as T[],
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (e) {
      return {
        data: [],
        meta: { page, limit, total: 0, totalPages: 0 }
      };
    }
  }

  async create(data: Partial<T>): Promise<T> {
    const { data: created, error } = await supabaseAdmin
      .from(this.tableName)
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create record in ${this.tableName}: ${error.message}`);
    }
    return created as T;
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    const { data: updated, error } = await supabaseAdmin
      .from(this.tableName)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update record ${id} in ${this.tableName}: ${error.message}`);
    }
    return updated as T;
  }

  async softDelete(id: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from(this.tableName)
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      return !error;
    } catch (e) {
      return false;
    }
  }
}
