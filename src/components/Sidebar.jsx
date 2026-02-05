import { Search, LayoutGrid, Heart } from 'lucide-react';
import { cn } from '../utils/cn';

export const Sidebar = ({
    categories,
    selectedCategory,
    onSelectCategory,
    searchQuery,
    onSearchChange,
    totalPrompts
}) => {
    return (
        <div className="w-full md:w-72 bg-white border-b md:border-b-0 md:border-r border-gray-100 flex-shrink-0 flex flex-col h-auto md:h-full">
            <div className="p-4 md:p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-4 md:mb-8">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <LayoutGrid className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Prompt Manager</h1>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="제목, 태그 검색..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        메뉴
                    </div>

                    <button
                        onClick={() => onSelectCategory('All')}
                        className={cn(
                            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            selectedCategory === 'All'
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <span>전체 프롬프트</span>
                        <span className="bg-white text-xs px-2 py-0.5 rounded-md border border-gray-200 text-gray-500">
                            {totalPrompts}
                        </span>
                    </button>

                    <button
                        onClick={() => onSelectCategory('Favorites')}
                        className={cn(
                            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            selectedCategory === 'Favorites'
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            <span>즐겨찾기</span>
                        </div>
                    </button>

                    <div className="pt-4 px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        카테고리
                    </div>

                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => onSelectCategory(cat.name)}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                selectedCategory === cat.name
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <span>{cat.name}</span>
                            <span className={cn(
                                "text-xs px-2 py-0.5 rounded-md border text-gray-500",
                                selectedCategory === cat.name ? "bg-indigo-100 border-indigo-200" : "bg-white border-gray-200"
                            )}>
                                {cat.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-gray-100 text-xs text-center text-gray-400">
                Prompt Manager v1.1
            </div>
        </div>
    );
};
