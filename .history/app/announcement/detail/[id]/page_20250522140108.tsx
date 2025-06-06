'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import OwnerHeader from "@/components/header/OwnerHeader";
import { useUser } from '@/context/UserContext';

export default function AnnouncementDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const announcementId = params.id;
  const restaurantId = searchParams.get('restaurantId');

 
  const [announcement, setAnnouncement] = useState<any>(null);
  const { memberId, memberRole, memberEmail } = useUser();
  
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
    }

  }





  const fetchData = async () => {
    if (!announcementId || !restaurantId) {
      alert("Wrong request");
      router.push(`/announcement/list?restaurantId=${restaurantId}`);
      return;
    } 
    const jwt = getJwt()
    if (jwt == null){
        alert("something wrong!")
        return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcement/detail/${announcementId}?restaurantId=${restaurantId}`,{
        headers : {
            'Authorization': `Bearer ${jwt}`,
      }}
    );
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
    const jwt = getJwt()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcement/delete/${announcementId}?restaurantId=${restaurantId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwt}`,
        },
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
  }, [announcementId, restaurantId, memberId, memberRole, memberEmail]);

  return (
    <div className='wrapper'>
         
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

          {
      (
        (announcement.writerId === memberId &&
        announcement.writerName === memberEmail?.toString() &&
        announcement.writerRole === memberRole)
        ||
         memberRole === 'OWNER' && "MANAGER"
  ) && (
            <div className="text-end mt-3">
            <button
              className="btn btn-primary me-2"
              onClick={() =>
                router.push(`/announcement/update/${announcementId}?restaurantId=${restaurantId}`)
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
    </div>
  );
}