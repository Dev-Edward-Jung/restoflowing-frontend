'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import OwnerHeader from "@/components/header/OwnerHeader";
import { useUser } from '@/context/UserContext';

interface Announcement {
    id: number;
    title: string;
    type: 'NOTICE' | 'NORMAL';
}



export default function AnnouncementList() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const restaurantId = searchParams.get('restaurantId');

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);



    useEffect(() => {
        if (!restaurantId) {
            alert('Restaurant ID가 없습니다.');
            router.push('/page/owner/login');
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

        loadAnnouncements(currentPage, jwt);
    }, [restaurantId, currentPage]);

    const loadAnnouncements = async (page: number, jwt : string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcement/list?restaurantId=${restaurantId}&page=${page}&size=5`,{
            headers: {
                'Authorization': `Bearer ${jwt}`,
              },
        }
            
        )
        ;
        if (!res.ok) {
            alert('공지사항 불러오기 실패');
            return;
        }
        const data = await res.json();
        setAnnouncements(data.content);
        setTotalPages(data.totalPages);
        setCurrentPage(page);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        return (
            <nav className="mt-4">
                <ul className="pagination justify-content-center">
                    <li className="page-item">
                        <button className="page-link" onClick={() => handlePageChange(0)}>&laquo;</button>
                    </li>
                    <li className="page-item">
                        <button className="page-link" onClick={() => handlePageChange(Math.max(0, currentPage - 1))}>&lsaquo;</button>
                    </li>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(i)}>{i + 1}</button>
                        </li>
                    ))}
                    <li className="page-item">
                        <button className="page-link" onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}>&rsaquo;</button>
                    </li>
                    <li className="page-item">
                        <button className="page-link" onClick={() => handlePageChange(totalPages - 1)}>&raquo;</button>
                    </li>
                </ul>
            </nav>
        );
    };

    const noticeList = announcements.filter(item => item.type === 'NOTICE');
    const normalList = announcements.filter(item => item.type === 'NORMAL');

    return (
        <div className='wrapper'>
            <OwnerHeader />
            <div className="card p-4">
            <h5 className="card-header">Announcement</h5>

            <div className="card-body">
                <div className="list-group">
                    {noticeList.map(item => (
                        <a
                            key={item.id}
                            href={`/announcement/detail/${item.id}?restaurantId=${restaurantId}`}
                            className="list-group-item list-group-item-action text-danger font-bold"
                        >
                            🔔 [Notice] {item.title}
                        </a>
                    ))}
                    {normalList.map(item => (
                        <a
                            key={item.id}
                            href={`/announcement/detail/${item.id}?restaurantId=${restaurantId}`}
                            className="list-group-item list-group-item-action"
                        >
                            {item.title}
                        </a>
                    ))}
                    {announcements.length === 0 && <p>There is no announcement.</p>}
                </div>
            </div>

            <div className="text-right mt-3">
                <button
                    className="btn btn-primary"
                    onClick={() => router.push(`/announcement/create?restaurantId=${restaurantId}`)}
                >
                    Post
                </button>
            </div>

            {renderPagination()}
        </div>
        </div>
    );
}