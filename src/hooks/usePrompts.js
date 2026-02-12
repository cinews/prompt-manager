import { useState, useEffect } from 'react';
import { getPrompts, createPrompt, updatePrompt, deletePrompt, toggleLikePrompt } from '../utils/storage';

export const usePrompts = () => {
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initial fetch
    useEffect(() => {
        fetchPrompts();
    }, []);

    const fetchPrompts = async () => {
        try {
            setLoading(true);
            const data = await getPrompts();
            setPrompts(data || []);
        } catch (err) {
            console.error('Failed to fetch prompts:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const addPrompt = async (promptData) => {
        try {
            const newPrompt = await createPrompt(promptData);
            setPrompts((prev) => [newPrompt, ...prev]);
            return newPrompt;
        } catch (err) {
            console.error('Failed to add prompt:', err);
            throw err;
        }
    };

    const editPrompt = async (prompt) => {
        try {
            const updated = await updatePrompt(prompt);
            setPrompts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            return updated;
        } catch (err) {
            console.error('Failed to update prompt:', err);
            throw err;
        }
    };

    const removePrompt = async (id) => {
        try {
            await deletePrompt(id);
            setPrompts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error('Failed to delete prompt:', err);
            throw err;
        }
    };

    const toggleLike = async (id) => {
        try {
            const updated = await toggleLikePrompt(id);
            setPrompts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        } catch (err) {
            console.error('Failed to toggle like:', err);
            throw err;
        }
    };

    return {
        prompts,
        loading,
        error,
        addPrompt,
        editPrompt,
        removePrompt,
        toggleLike,
        refresh: fetchPrompts
    };
};
