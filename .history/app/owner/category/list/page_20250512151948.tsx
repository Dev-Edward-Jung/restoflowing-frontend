'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Category {
    id: number;
    name: string;
}

export default function CategoryPage() {
    const searchParams = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [newCategory, setNewCategory] = useState('');

    const getCsrfInfo = () => {
        const token = document.querySelector('meta[name="_csrf"]')?.getAttribute('content') || '';
        const header = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content') || '';
        return { token, header };
    };

    const fetchCategories = async () => {
        const { token, header } = getCsrfInfo();
        const res = await fetch(`/api/category/list?restaurantId=${restaurantId}`, {
            headers: { [header]: token },
        });
        if (res.ok) {
            const data = await res.json();
            setCategories(data);
        }
    };

    const handleAdd = async () => {
        const { token, header } = getCsrfInfo();
        await fetch('/api/category/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [header]: token,
            },
            body: JSON.stringify({ name: newCategory, restaurantId }),
        });
        setNewCategory('');
        fetchCategories();
    };

    const handleUpdate = async () => {
        const { token, header } = getCsrfInfo();
        if (!editingCategory) return;
        await fetch('/api/category/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                [header]: token,
            },
            body: JSON.stringify({ ...editingCategory, restaurantId }),
        });
        setEditingCategory(null);
        fetchCategories();
    };

    const handleDelete = async (id: number) => {
        const { token, header } = getCsrfInfo();
        await fetch('/api/category/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                [header]: token,
            },
            body: JSON.stringify({ id, restaurantId }),
        });
        fetchCategories();
    };

    useEffect(() => {
        if (restaurantId) {
            fetchCategories();
        }
    }, [restaurantId]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Category List</h2>
            <div className="space-y-3">
                {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-3">
                        <input
                            type="text"
                            className="border rounded p-2 flex-1"
                            value={editingCategory?.id === cat.id ? editingCategory.name : cat.name}
                            onChange={(e) => {
                                if (editingCategory?.id === cat.id) {
                                    setEditingCategory({ ...editingCategory, name: e.target.value });
                                }
                            }}
                            disabled={editingCategory?.id !== cat.id}
                        />
                        {editingCategory?.id === cat.id ? (
                            <>
                                <button className="btn btn-primary" onClick={handleUpdate}>Save</button>
                                <button className="btn btn-secondary" onClick={() => setEditingCategory(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-outline" onClick={() => setEditingCategory(cat)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(cat.id)}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
                <div className="flex gap-2 mt-4">
                    <input
                        className="form-control"
                        placeholder="New category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleAdd}>Add</button>
                </div>
            </div>
        </div>
    );
}