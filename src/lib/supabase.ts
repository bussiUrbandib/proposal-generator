import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isConfigured = supabaseUrl.startsWith("http") && supabaseAnonKey.length > 0;

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type Proposal = {
  id: string;
  url: string;
  prompt_used: string;
  result: string;
  created_at: string;
};

export type PromptTemplate = {
  id: string;
  name: string;
  content: string;
  is_default: boolean;
  created_at: string;
};
