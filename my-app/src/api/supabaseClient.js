import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://sjdmkvrifubtylttbghn.supabase.co";
const supabaseAnonKey = "sb_publishable_-vRR65ML1RQ8ImnT4F0Fww_q3NLRZFt";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);