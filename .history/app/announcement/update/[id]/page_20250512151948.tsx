'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function AnnouncementUpdatePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { id } = useParams(); // announcement ID
    const restaurantId = searchParams.get('restaurantId');

    const [title, setTitle] = useState('');
    const [type, setType] = useState<'NOTICE' | 'NORMAL'>('NORMAL');
    const [csrfToken, setCsrfToken] = useState('');
    const [csrfHeader, setCsrfHeader] = useState('');

    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
    });

    // Fetch CSRF Meta info
    useEffect(() => {
        const token = document.querySelector('meta[name="_csrf"]')?.getAttribute('content') || '';
        const header = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content') || '';
        setCsrfToken(token);
        setCsrfHeader(header);
    }, []);

    // Fetch Announcement Data
    useEffect(() => {
        if (!id || !restaurantId || !editor) return;

        const fetchData = async () => {
            const res = await fetch(`/api/announcement/detail/${id}?restaurantId=${restaurantId}`);
            if (!res.ok) {
                alert('Failed to fetch data.');
                router.push(`/page/announcement/list?restaurantId=${restaurantId}`);
                return;
            }

            const data = await res.json();
            setTitle(data.title);
            setType(data.type);
            editor.commands.setContent(data.content);
        };

        fetchData();
    }, [id, restaurantId, editor]);

    const handleUpdate = async () => {
        const content = editor?.getHTML() || '';
        const res = await fetch(`/api/announcement/update/${id}?restaurantId=${restaurantId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken,
            },
            body: JSON.stringify({ title, content, type }),
        });

        if (res.ok) {
            alert('Updated successfully!');
            router.push(`/page/announcement/detail/${id}?restaurantId=${restaurantId}`);
        } else {
            alert('Update failed.');
        }
    };

    const handleDelete = async () => {
        const confirmed = confirm('Do you really want to delete this?');
        if (!confirmed) return;

        const res = await fetch(`/api/announcement/delete/${id}?restaurantId=${restaurantId}`, {
            method: 'DELETE',
            headers: {
                [csrfHeader]: csrfToken,
            },
        });

        if (res.ok) {
            alert('Deleted successfully!');
            router.push(`/page/announcement/list?restaurantId=${restaurantId}`);
        } else {
            alert('Delete failed.');
        }
    };

    return (
        <div className="card p-4">
            <div className="card-body">
                <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input
                            id="title"
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                        />
                    </div>

                    <div className="mb-3">
                        <EditorContent editor={editor} className="min-h-[300px] border rounded-md p-2" />
                    </div>

                    <div className="btn-group mb-3" role="group" aria-label="Radio group">
                        <input
                            type="radio"
                            className="btn-check"
                            id="radio-normal"
                            name="btnradio"
                            checked={type === 'NORMAL'}
                            onChange={() => setType('NORMAL')}
                        />
                        <label className="btn btn-outline-primary" htmlFor="radio-normal">Normal</label>

                        <input
                            type="radio"
                            className="btn-check"
                            id="radio-notice"
                            name="btnradio"
                            checked={type === 'NOTICE'}
                            onChange={() => setType('NOTICE')}
                        />
                        <label className="btn btn-outline-primary" htmlFor="radio-notice">Notice</label>
                    </div>
                </form>
            </div>

            <div className="d-flex gap-2 px-4">
                <button onClick={handleUpdate} className="btn btn-primary">Update</button>
                <button onClick={handleDelete} className="btn btn-danger">Delete</button>
            </div>
        </div>
    );
}