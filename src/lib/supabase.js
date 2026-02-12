import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail gracefully if environment variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        'Supabase environment variables are missing. Please check your .env file or Vercel project settings.'
    );
}

export const supabase =
    supabaseUrl && supabaseAnonKey
        ? createClient(supabaseUrl, supabaseAnonKey)
        : {
            from: () => ({
                select: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
                insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) }),
                update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) }) }),
                delete: () => ({ eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } }) }),
            }),
        };
