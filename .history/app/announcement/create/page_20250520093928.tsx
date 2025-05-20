'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { useRouter } from 'next/router';
import StarterKit from '@tiptap/starter-kit';
import OwnerHeader from "@/components/header/OwnerHeader";

export default function AnnouncementCreate() {
    const router = useRouter();
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
        const getJwt = (): string | null => {
            if (typeof window === 'undefined') return null;
            return localStorage.getItem('jwtToken');
          };
        const jwt = getJwt();
        if (!jwt) {
            router.push('/auth/owner/login');
            return;
        }
        setRestaurantId(id);
    }, []);

    const sendContent = async () => {
        const content = editor?.getHTML() || '';

        if (!restaurantId) {
            alert('레스토랑 ID가 없습니다. 다시 로그인해주세요.');
            return;
        }

        const getJwt = (): string | null => {
            if (typeof window === 'undefined') return null;
            return localStorage.getItem('jwtToken');
          };
        const jwt = getJwt();
        if (!jwt) {
            router.push('/auth/owner/login');
            return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcement/save?restaurantId=${restaurantId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify({
                title,
                content,
                type,
            }),
        });

        if (response.ok) {
            alert('Successfully saved!');
            window.location.href = `/announcement/list?restaurantId=${restaurantId}`;
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