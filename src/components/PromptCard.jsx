import { Copy, Edit2, Trash2, Heart, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';
import { useState } from 'react';

export const PromptCard = ({ prompt, onClick, onEdit, onDelete, onLike, isAdmin }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(prompt.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            onClick={() => onClick(prompt)}
            className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col h-full cursor-pointer"
        >
            <div className="flex justify-between items-start mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                    {prompt.category}
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); onLike(prompt.id); }}
                    className={cn(
                        "p-2 rounded-full transition-colors",
                        prompt.isLiked ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-gray-50"
                    )}
                >
                    <Heart className={cn("w-5 h-5", prompt.isLiked && "fill-current")} />
                </button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {prompt.title}
            </h3>

            <div className="bg-gray-50 rounded-lg p-3 mb-4 font-mono text-sm text-gray-600 line-clamp-3 overflow-hidden">
                {prompt.content}
            </div>

            {prompt.tags && prompt.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {prompt.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                    {prompt.referenceUrl && (
                        <a
                            href={prompt.referenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                            title="참조 링크 열기"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleCopy} title="내용 복사">
                        <Copy className={cn("w-4 h-4", copied && "text-green-500")} />
                    </Button>
                    {isAdmin && (
                        <>
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(prompt); }} title="수정">
                                <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDelete(prompt.id); }} title="삭제" className="text-red-400 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
