'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function AnnouncementCreate() {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'NOTICE' | 'NORMAL'>('NORMAL');
    const [restaurantId, setRestaurantId] = useState<string | null>(null);

    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('restaurantId');
        setRestaurantId(id);
    }, []);

    const sendContent = async () => {
        const content = editor?.getHTML() || '';

        if (!restaurantId) {
            alert('레스토랑 ID가 없습니다. 다시 로그인해주세요.');
            return;
        }

        const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');

        const response = await fetch(`/api/announcement/save?restaurantId=${restaurantId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(csrfHeader && csrfToken ? { [csrfHeader]: csrfToken } : {}),
            },
            body: JSON.stringify({
                title,
                content,
                type,
            }),
        });

        if (response.ok) {
            alert('Successfully saved!');
            window.location.href = `/page/announcement/list?restaurantId=${restaurantId}`;
        } else {
            alert('Save Error');
        }
    };
    return (
        <div className="card p-4">
            <div className="card-body">
                <form>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="basic-default-title">Title</label>
                        <div className="input-group input-group-merge">
                            <input
                                type="text"
                                id="basic-default-title"
                                className="form-control"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>
                        <EditorContent
                            editor={editor}
                        />

                    <div className="btn-group mt-3 owner-manager-only" role="group" aria-label="Content Type Select">
                        <input
                            type="radio"
                            className="btn-check"
                            name="btnradio"
                            id="btnradio1"
                            value="NOTICE"
                            onChange={() => setType('NOTICE')}
                        />
                        <label className="btn btn-outline-primary" htmlFor="btnradio1">Notice</label>

                        <input
                            type="radio"
                            className="btn-check"
                            name="btnradio"
                            id="btnradio2"
                            value="NORMAL"
                            checked={type === 'NORMAL'}
                            onChange={() => setType('NORMAL')}
                        />
                        <label className="btn btn-outline-primary" htmlFor="btnradio2">Normal</label>
                    </div>
                </form>
            </div>
            <div className="menu-link">
                <button type="button" className="btn btn-primary mt-3 saveBtn" onClick={sendContent}>
                    Post
                </button>
            </div>
        </div>
    );
}