'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import OwnerHeader from "@/components/header/OwnerHeader";
import { getUserInfoFromToken } from "@/components/role/RoleFunction"

export default function AnnouncementDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const announcementId = params.id;
  const restaurantId = searchParams.get('restaurantId');
  const [memberId, setMemberId] = useState<string|null>();
  const [memberRole, setMemberRole] = useState<string|null>();
  const [memberEmail, setMemberEmail] = useState<string|null>();
 
  const [announcement, setAnnouncement] = useState<any>(null);

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
      console.log("writer id : " + data.writerId)
      console.log("writer id : " +memberId)
      console.log("writer id : " +data.witerEmail)
      console.log("writer id : " +memberEmail)
      console.log("writer id : " +data.writerRole)
      console.log("writer id : " +memberRole)
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
    const token = getJwt();
    if (token) {
      const { role, id, email } = getUserInfoFromToken(token);
      setMemberId(id)
      setMemberEmail(email)
      setMemberRole(role)
    }
    fetchData();
  }, [announcementId, restaurantId, memberId, memberRole, memberEmail]);

  return (
    <div className='wrapper'>
        <OwnerHeader />
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
          announcement.writerId == memberId &&
           announcement.writerName == memberEmail?.toString() && 
           announcement.writerRole == memberRole && (
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