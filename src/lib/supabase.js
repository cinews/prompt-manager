import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail gracefully if environment variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        'Supabase environment variables are missing. Please check your .env file or Vercel project settings.'
    );
}

// Dummy client that supports chaining and returns an error
const createDummyClient = () => {
    const dummyBuilder = {
        select: () => dummyBuilder,
        insert: () => dummyBuilder,
        update: () => dummyBuilder,
        delete: () => dummyBuilder,
        eq: () => dummyBuilder,
        single: () => dummyBuilder,
        order: () => dummyBuilder,
        limit: () => dummyBuilder,
        then: (resolve) => resolve({ data: null, error: { message: 'Supabase environment variables missing' } }),
    };

    return {
        from: () => dummyBuilder,
    };
};

export const supabase =
    supabaseUrl && supabaseAnonKey
        ? createClient(supabaseUrl, supabaseAnonKey)
        : createDummyClient();
