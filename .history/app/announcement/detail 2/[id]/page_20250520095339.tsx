'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';

export default function AnnouncementDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const announcementId = params.announcementId as string;
  const restaurantId = searchParams.get('restaurantId');

  const [announcement, setAnnouncement] = useState<any>(null);
  const [loginUser, setLoginUser] = useState({ id: '', name: '' });

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
        alert("Token Failed")
    }

  }


  const fetchData = async () => {
    if (!announcementId || !restaurantId) {
      alert("Wrong request");
      router.push(`/announcement/list`);
      return;
    } 
    const jwt = getJwt()
    if (jwt == null){
        alert("something wrong!")
        return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcement/detail/${announcementId}?restaurantId=${restaurantId}`,{
        hea
      });
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setAnnouncement(data);
    } catch (err) {
      console.error(err);
      alert("Server Error");
      router.push(`/announcement/list?restaurantId=${restaurantId}`);
    }
  };

  const deleteAnnouncement = async () => {
    const confirmed = confirm("Would you really like to delete?");
    if (!confirmed) return;

    try {
      const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute('content') || '';
      const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content') || '';

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcement/delete/${announcementId}?restaurantId=${restaurantId}`, {
        method: 'DELETE',
        headers: {
          [csrfHeader]: csrfToken
        }
      });

      if (res.ok) {
        alert('Deleted!');
        router.push(`/announcement/list?restaurantId=${restaurantId}`);
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server Error');
    }
  };

  useEffect(() => {
    fetchData();
  }, [announcementId, restaurantId]);

  const isWriter =
    announcement &&
    loginUser.id === String(announcement.writerId) &&
    loginUser.name === announcement.writerName;

  return (
    <div className="container py-4">
      {announcement ? (
        <div className="card p-4">
          <h5 className="card-header">{announcement.title}</h5>
          <div className="text-end mb-2">
            <span>Writer: {announcement.writerName}</span>
          </div>
          <div className="card-body">
            <div dangerouslySetInnerHTML={{ __html: announcement.content }} />
          </div>

          {isWriter && (
            <div className="text-end mt-3">
              <button
                className="btn btn-primary me-2"
                onClick={() =>
                  router.push(`/page/announcement/update/${announcementId}?restaurantId=${restaurantId}`)
                }
              >
                Update
              </button>
              <button className="btn btn-danger" onClick={deleteAnnouncement}>
                Delete
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}