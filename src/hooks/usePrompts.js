import { useState, useEffect } from 'react';
import { getPrompts, createPrompt, updatePrompt, deletePrompt, toggleLikePrompt } from '../utils/storage';

export const usePrompts = () => {
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = getPrompts();
        setPrompts(data);
        setLoading(false);
    }, []);

    const addPrompt = (promptData) => {
        const updated = createPrompt(promptData);
        setPrompts(updated);
    };

    const editPrompt = (prompt) => {
        const updated = updatePrompt(prompt);
        setPrompts(updated);
    };

    const removePrompt = (id) => {
        const updated = deletePrompt(id);
        setPrompts(updated);
    };

    const toggleLike = (id) => {
        const updated = toggleLikePrompt(id);
        setPrompts(updated);
    }

    return {
        prompts,
        loading,
        addPrompt,
        editPrompt,
        removePrompt,
        toggleLike
    };
};
