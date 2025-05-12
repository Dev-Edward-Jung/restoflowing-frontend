'use client';

import { useEffect, useState } from 'react';

export default function AnnouncementDetailPage() {
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        // 이 부분을 API 호출로 대체하면 됩니다.
        // 예: const { id } = useParams(); fetch(`/api/announcement/${id}`)
        const dummyData = {
            title: 'Sample Announcement Title',
            writer: 'John Doe',
            content: `
        <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
        <p>Duis mollis, est non commodo luctus. Duis mollis, est non commodo luctus.</p>
      `,
        };

        setTitle(dummyData.title);
        setWriter(dummyData.writer);
        setContent(dummyData.content);
    }, []);

    return (
        <div className="card p-4">
            <h5 className="card-header">{title}</h5>
            <div className="text-right mb-2">
                <span className="font-semibold">Writer :</span> <span>{writer}</span>
            </div>
            <div className="card-body">
                <div id="content" className="m-lg-1" dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
            <div className="text-right" id="btn-wrapper">
                {/* 버튼 영역 (예: 수정/삭제) 필요시 여기에 추가 */}
            </div>
        </div>
    );
}