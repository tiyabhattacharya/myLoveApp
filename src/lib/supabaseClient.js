import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const allowedEmailsString = import.meta.env.VITE_ALLOWED_EMAILS;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const ALLOWED_EMAILS = allowedEmailsString
  ? allowedEmailsString
      .split(',')             // Split the string by the comma
      .map(email => email.trim()) // Trim whitespace from each email
  : [];
  
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// export const ALLOWED_EMAILS = [
//   'tiyab2682@gmail.com',
//   'tiyaabhattacharya@gmail.com',
//   '221b117@juetguna.in'
// ];
