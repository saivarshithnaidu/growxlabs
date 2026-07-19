import { config } from "dotenv";
config({ path: ".env.local" });

export interface EnvConfig {
  NODE_ENV: "development" | "production" | "test";
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  GEMINI_API_KEY?: string;
  REDIS_URL?: string;
  R2_BUCKET_NAME?: string;
  IS_PRODUCTION: boolean;
}

function validateEnvironment(): EnvConfig {
  const nodeEnv = (process.env.NODE_ENV as any) || "development";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";

  const isProduction = nodeEnv === "production";

  if (isProduction && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    console.warn("WARNING: Production environment requires valid SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY!");
  }

  return {
    NODE_ENV: nodeEnv,
    SUPABASE_URL: supabaseUrl,
    SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    REDIS_URL: process.env.REDIS_URL,
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    IS_PRODUCTION: isProduction
  };
}

export const ENV = validateEnvironment();
