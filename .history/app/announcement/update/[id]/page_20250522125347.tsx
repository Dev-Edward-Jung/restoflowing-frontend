'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import OwnerHeader from "@/components/header/OwnerHeader";
import { useUser } from '@/context/UserContext';

export default function AnnouncementUpdatePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { id } = useParams(); // announcement ID
    const restaurantId = searchParams.get('restaurantId');
    const { memberId, memberRole, memberEmail } = useUser();

    const [title, setTitle] = useState('');
    const [type, setType] = useState<'NOTICE' | 'NORMAL'>('NORMAL');

    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
    });

    function getJwt(){
        try{
            const getJwt = (): string | null => {
            if (typeof window === 'undefined') return null;
            return localStorage.getItem('jwtToken');
          };
        const jwt = getJwt();
        if (!jwt) {
            router.push('/auth/owner/login');
            return;
            }
    
            return jwt;
        }
        catch{
            alert(" Something Wrong")
            router.push("/auth/owner/login")
        }
    
      }


    // Fetch Announcement Data
    useEffect(() => {
        if (!id || !restaurantId || !editor) return;
        const jwt = getJwt();

        const fetchData = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcement/detail/${id}?restaurantId=${restaurantId}`,{
                headers:{
                    'Authorization': `Bearer ${jwt}`,
                }
            });
            if (!res.ok) {
                alert('Failed to fetch data.');
                router.push(`/announcement/list?restaurantId=${restaurantId}`);
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
        const jwt = getJwt()
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcement/update/${id}?restaurantId=${restaurantId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify({ title, content, type }),
        });

        if (res.ok) {
            alert('Updated successfully!');
            router.push(`/announcement/detail/${id}?restaurantId=${restaurantId}`);
        } else {
            alert('Update failed.');
        }
    };

    const handleDelete = async () => {
        const confirmed = confirm('Do you really want to delete this?');
        if (!confirmed) return;

        const jwt = getJwt();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcement/delete/${id}?restaurantId=${restaurantId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${jwt}`,
            },
        });

        if (res.ok) {
            alert('Deleted successfully!');
            router.push(`/announcement/list?restaurantId=${restaurantId}`);
        } else {
            alert('Delete failed.');
        }
    };

    return (
        <div className='wrapper'>
            <OwnerHeader />
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
        </div>
        
    );
}