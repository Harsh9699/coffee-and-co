import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aojpgcpyryihuoedhlzc.supabase.co';
const supabaseAnonKey = 'sb_publishable_WY2OBe7qieinfWll5KHw8A_IPSyn9B1';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
