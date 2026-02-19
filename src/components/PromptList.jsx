import { PromptCard } from './PromptCard';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export const PromptList = ({ prompts, onClick, onEdit, onDelete, onLike, isAdmin }) => {
    if (prompts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                    <span className="text-4xl">📭</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-500 max-w-sm">
                    다른 키워드로 검색하거나 새로운 프롬프트를 등록해보세요.
                </p>
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
        >
            {prompts.map((prompt) => (
                <motion.div key={prompt.id} variants={item}>
                    <PromptCard
                        prompt={prompt}
                        onClick={onClick}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onLike={onLike}
                        isAdmin={isAdmin}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};
