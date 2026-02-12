import { useState, useMemo } from 'react';
import { Plus, LayoutGrid, Search, Heart, X } from 'lucide-react';
import { PromptList } from './components/PromptList';
import { PromptForm } from './components/PromptForm';
import { PromptDetailModal } from './components/PromptDetailModal';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { usePrompts } from './hooks/usePrompts';
import { cn } from './utils/cn';

function App() {
  const { prompts, addPrompt, editPrompt, removePrompt, toggleLike } = usePrompts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [viewingPrompt, setViewingPrompt] = useState(null);

  // Filter Logic
  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      let matchesCategory = true;
      if (selectedCategory === 'Favorites') {
        matchesCategory = prompt.isLiked;
      } else if (selectedCategory !== 'All') {
        matchesCategory = prompt.category === selectedCategory;
      }

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        prompt.title.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [prompts, selectedCategory, searchQuery]);

  // Stats Logic - for category tabs
  const categories = useMemo(() => {
    const counts = {};
    prompts.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.keys(counts).map(name => ({
      name,
      count: counts[name]
    })).sort((a, b) => b.count - a.count);
  }, [prompts]);

  const handleCreateOpen = () => {
    setEditingPrompt(null);
    setIsModalOpen(true);
  };

  const handleEditOpen = (prompt) => {
    setEditingPrompt(prompt);
    setIsModalOpen(true);
    setViewingPrompt(null);
  };

  const handleDetailOpen = (prompt) => {
    setViewingPrompt(prompt);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingPrompt) {
        await editPrompt({ ...editingPrompt, ...data });
      } else {
        const newPrompt = await addPrompt(data);
        setSearchQuery('');
        setSelectedCategory('All');
        setViewingPrompt(newPrompt);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Operation failed", error);
      alert("적용 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm('정말 이 프롬프트를 삭제하시겠습니까?')) {
      try {
        await removePrompt(id);
        if (viewingPrompt?.id === id) setViewingPrompt(null);
      } catch (error) {
        console.error("Delete failed", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-900">
      {/* 1. Header Area */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Prompt Manager</h1>
          </div>

          <Button onClick={handleCreateOpen}>
            <Plus className="w-5 h-5 mr-2" />
            새 프롬프트
          </Button>
        </div>
      </header>

      {/* 2. Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* Top Controls: Search + Favorites */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="제목, 태그, 내용 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="검색어 초기화"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setSelectedCategory('Favorites')}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-medium border transition-all shadow-sm",
                selectedCategory === 'Favorites'
                  ? "bg-rose-50 border-rose-200 text-rose-600 ring-2 ring-rose-500/10"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Heart className={cn("w-5 h-5", selectedCategory === 'Favorites' && "fill-current")} />
              <span>즐겨찾기</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                selectedCategory === 'All'
                  ? "bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-900/20"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              전체
              <span className={cn(
                "ml-2 text-xs py-0.5 px-1.5 rounded-full",
                selectedCategory === 'All' ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-500"
              )}>
                {prompts.length}
              </span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  selectedCategory === cat.name
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                )}
              >
                {cat.name}
                <span className={cn(
                  "ml-2 text-xs py-0.5 px-1.5 rounded-full",
                  selectedCategory === cat.name ? "bg-indigo-500 text-indigo-100" : "bg-gray-100 text-gray-500"
                )}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Prompt List */}
          <div>


            <PromptList
              key={selectedCategory + searchQuery}
              prompts={filteredPrompts}
              onClick={handleDetailOpen}
              onEdit={handleEditOpen}
              onDelete={handleDelete}
              onLike={toggleLike}
            />
          </div>
        </div>
      </main>

      {/* Editor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPrompt ? '프롬프트 수정' : '새 프롬프트 등록'}
      >
        <PromptForm
          initialData={editingPrompt}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Detail Modal */}
      <PromptDetailModal
        isOpen={!!viewingPrompt}
        onClose={() => setViewingPrompt(null)}
        prompt={viewingPrompt}
        onEdit={handleEditOpen}
        onDelete={handleDelete}
        onLike={toggleLike}
      />
    </div>
  );
}

export default App;
