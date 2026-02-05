import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'prompt-manager-data';

const INITIAL_DATA = [
    {
        id: '1',
        title: 'Code Refactoring Expert',
        category: 'Programming',
        content: 'You are an expert software engineer. Review the following code and suggest improvements for readability, performance, and security.',
        usage: 'Paste your code after the prompt.',
        tags: ['coding', 'refactoring', 'clean-code'],
        isLiked: true,
        createdAt: Date.now(),
    },
    {
        id: '2',
        title: 'Creative Story Starter',
        category: 'Creative Writing',
        content: 'Write a short story starting with the sentence: "The clock struck thirteen, and the mismatched socks in the dryer began to sing."',
        usage: 'Use this to break writer\'s block.',
        tags: ['story', 'creative', 'fiction'],
        isLiked: false,
        createdAt: Date.now() - 10000,
    },
    {
        id: '3',
        title: 'Email Polisher',
        category: 'Marketing',
        content: 'Rewrite the following email to be more professional, concise, and persuasive.',
        usage: 'Paste your draft email.',
        tags: ['email', 'business', 'communication'],
        isLiked: false,
        createdAt: Date.now() - 20000,
    }
];

export const getPrompts = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
        return INITIAL_DATA;
    }
    return JSON.parse(data);
};

export const savePrompts = (prompts) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
};

export const createPrompt = (promptData) => {
    const newPrompt = {
        id: uuidv4(),
        createdAt: Date.now(),
        isLiked: false,
        ...promptData,
    };
    const prompts = getPrompts();
    const updatedPrompts = [newPrompt, ...prompts];
    savePrompts(updatedPrompts);
    return updatedPrompts;
};

export const updatePrompt = (updatedPrompt) => {
    const prompts = getPrompts();
    const newPrompts = prompts.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p));
    savePrompts(newPrompts);
    return newPrompts;
};

export const deletePrompt = (id) => {
    const prompts = getPrompts();
    const newPrompts = prompts.filter((p) => p.id !== id);
    savePrompts(newPrompts);
    return newPrompts;
};

export const toggleLikePrompt = (id) => {
    const prompts = getPrompts();
    const newPrompts = prompts.map(p => p.id === id ? { ...p, isLiked: !p.isLiked } : p);
    savePrompts(newPrompts);
    return newPrompts;
}
