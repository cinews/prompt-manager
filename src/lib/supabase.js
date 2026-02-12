import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug log to check env vars
console.log('Supabase Config:', {
    urlExists: !!supabaseUrl,
    keyExists: !!supabaseAnonKey
});

const createDummyClient = () => {
    // Use a variable to safe-guard against circular reference issues during initialization
    const builder = {};

    // Assign methods to the object
    Object.assign(builder, {
        select: () => builder,
        insert: () => builder,
        update: () => builder,
        delete: () => builder,
        eq: () => builder,
        single: () => builder,
        order: () => builder,
        limit: () => builder,
        // Return a promise-like object that resolves to an error
        then: (resolve) => resolve({
            data: null,
            error: { message: 'Supabase environment variables are missing. Please check your .env file.' }
        }),
    });

    return {
        from: () => builder,
    };
};

export const supabase =
    supabaseUrl && supabaseAnonKey
        ? createClient(supabaseUrl, supabaseAnonKey)
        : createDummyClient();
