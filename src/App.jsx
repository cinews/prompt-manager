import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { PromptList } from './components/PromptList';
import { PromptForm } from './components/PromptForm';
import { PromptDetailModal } from './components/PromptDetailModal';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { usePrompts } from './hooks/usePrompts';

function App() {
  const { prompts, addPrompt, editPrompt, removePrompt, toggleLike } = usePrompts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);

  // New state for Detail Modal
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

  // Stats Logic
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
    // Be sure to close Detail view if open (though modal usually overlays)
    setViewingPrompt(null);
  };

  const handleDetailOpen = (prompt) => {
    setViewingPrompt(prompt);
  };

  const handleFormSubmit = (data) => {
    if (editingPrompt) {
      editPrompt({ ...editingPrompt, ...data });
    } else {
      addPrompt(data);
      // "Refresh" the view by resetting filters so the new prompt is visible
      setSearchQuery('');
      setSelectedCategory('All');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('정말 이 프롬프트를 삭제하시겠습니까?')) {
      removePrompt(id);
      if (viewingPrompt?.id === id) setViewingPrompt(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalPrompts={prompts.length}
      />

      <main className="flex-1 overflow-y-auto min-w-0">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'All' ? '전체 프롬프트' :
                selectedCategory === 'Favorites' ? '즐겨찾기' : selectedCategory}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredPrompts.length} {filteredPrompts.length === 1 ? '개의 프롬프트' : '개의 프롬프트'}
            </p>
          </div>

          <Button onClick={handleCreateOpen} className="shrink-0">
            <Plus className="w-5 h-5 mr-2" />
            새 프롬프트
          </Button>
        </header>

        <div className="p-2">
          <PromptList
            prompts={filteredPrompts}
            onClick={handleDetailOpen}
            onEdit={handleEditOpen}
            onDelete={handleDelete}
            onLike={toggleLike}
          />
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
