import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Copy, ExternalLink, Heart, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { useState } from 'react';

export const PromptDetailModal = ({ isOpen, onClose, prompt, onEdit, onDelete, onLike }) => {
    const [copied, setCopied] = useState(false);

    if (!prompt) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="프롬프트 상세정보">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-start justify-between">
                    <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 mb-2">
                            {prompt.category}
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900">{prompt.title}</h2>
                    </div>
                    <button
                        onClick={() => onLike(prompt.id)}
                        className={cn(
                            "p-2 rounded-full transition-colors",
                            prompt.isLiked ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-gray-50"
                        )}
                    >
                        <Heart className={cn("w-6 h-6", prompt.isLiked && "fill-current")} />
                    </button>
                </div>

                {/* Content Section */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-700">프롬프트 내용</h3>
                        <Button variant="ghost" size="sm" onClick={handleCopy} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                            <Copy className={cn("w-4 h-4 mr-1.5", copied && "text-green-500")} />
                            {copied ? '복사됨' : '복사하기'}
                        </Button>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-100">
                        {prompt.content}
                    </div>
                </div>

                {/* Usage Section */}
                {prompt.usage && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">사용 방법</h3>
                        <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                            {prompt.usage}
                        </div>
                    </div>
                )}

                {/* Tags & URL */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                    {prompt.tags && prompt.tags.map(tag => (
                        <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                            #{tag}
                        </span>
                    ))}

                    {prompt.referenceUrl && (
                        <a
                            href={prompt.referenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto flex items-center text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                        >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            참조 링크
                        </a>
                    )}
                </div>

                {/* Actions Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button variant="secondary" onClick={() => onEdit(prompt)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        수정
                    </Button>
                    <Button variant="danger" onClick={() => { onDelete(prompt.id); onClose(); }}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        삭제
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
