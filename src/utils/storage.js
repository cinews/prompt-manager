import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Helper to map DB row to App format
const fromDB = (row) => ({
    ...row,
    isLiked: row.is_liked,
    createdAt: row.created_at,
    // ensure tags is an array
    tags: Array.isArray(row.tags) ? row.tags : []
});

// Helper to map App data to DB format
const toDB = (data) => {
    const { isLiked, createdAt, ...rest } = data;
    return {
        ...rest,
        is_liked: isLiked,
        created_at: createdAt
    };
};

export const getPrompts = async () => {
    const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(fromDB);
};

export const createPrompt = async (promptData) => {
    const newPrompt = {
        id: uuidv4(),
        created_at: new Date().toISOString(), // Use ISO string for DB timestamptz
        is_liked: false,
        ...promptData,
        // Ensure toDB mapping is respected if we pass camelCase props, but here we construct explicitly
        // promptData might have camelCase, so let's handle it carefully
    };

    // Prepare payload. promptData usually has: title, category, content, usage, tags.
    const payload = {
        id: newPrompt.id,
        title: promptData.title,
        category: promptData.category,
        content: promptData.content,
        usage: promptData.usage,
        tags: promptData.tags,
        is_liked: false,
        created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('prompts')
        .insert([payload])
        .select()
        .single();

    if (error) throw error;
    return fromDB(data);
};

export const updatePrompt = async (updatedPrompt) => {
    const payload = toDB(updatedPrompt);
    // remove ID from payload so we don't try to update it (though Supabase ignores it usually)
    const { id, ...updates } = payload;

    const { data, error } = await supabase
        .from('prompts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return fromDB(data);
};

export const deletePrompt = async (id) => {
    const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return id;
};

export const toggleLikePrompt = async (id) => {
    // First get current status
    const { data: current, error: fetchError } = await supabase
        .from('prompts')
        .select('is_liked')
        .eq('id', id)
        .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
        .from('prompts')
        .update({ is_liked: !current.is_liked })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return fromDB(data);
};
