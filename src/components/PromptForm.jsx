import { useState, useEffect } from 'react';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Select } from './ui/Select';
import { Button } from './ui/Button';

const CATEGORIES = [
    { value: '', label: '카테고리 선택' },
    { value: '교육/학습', label: '교육/학습' },
    { value: '디자인/창작', label: '디자인/창작' },
    { value: '마케팅', label: '마케팅' },
    { value: '비즈니스생산성', label: '비즈니스생산성' },
    { value: '일상생활', label: '일상생활' },
    { value: '콘텐츠제작', label: '콘텐츠제작' },
    { value: '기타', label: '기타' },
];

export const PromptForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        usage: '',
        tags: '',
        referenceUrl: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                tags: initialData.tags.join(', '), // Convert array to comma-separated string
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = '제목을 입력해주세요';
        if (!formData.category) newErrors.category = '카테고리를 선택해주세요';
        if (!formData.content.trim()) newErrors.content = '프롬프트 내용을 입력해주세요';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const submittedData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        };

        onSubmit(submittedData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="제목"
                    name="title"
                    placeholder="예: 코드 리팩토링 전문가"
                    value={formData.title}
                    onChange={handleChange}
                    error={errors.title}
                />
                <Select
                    label="카테고리"
                    name="category"
                    options={CATEGORIES}
                    value={formData.category}
                    onChange={handleChange}
                    error={errors.category}
                />
            </div>

            <Textarea
                label="프롬프트 내용"
                name="content"
                placeholder="프롬프트 텍스트를 입력하세요..."
                rows={6}
                value={formData.content}
                onChange={handleChange}
                error={errors.content}
            />

            <Textarea
                label="사용 방법"
                name="usage"
                placeholder="이 프롬프트를 어떻게 사용하나요?"
                rows={2}
                value={formData.usage}
                onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="태그"
                    name="tags"
                    placeholder="쉼표(,)로 구분하여 입력"
                    value={formData.tags}
                    onChange={handleChange}
                />
                <Input
                    label="참조 URL"
                    name="referenceUrl"
                    placeholder="https://..."
                    value={formData.referenceUrl}
                    onChange={handleChange}
                />
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    취소
                </Button>
                <Button type="submit">
                    {initialData ? '수정 완료' : '등록'}
                </Button>
            </div>
        </form>
    );
};
