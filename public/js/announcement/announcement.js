document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const restaurantId = params.get("restaurantId");
    let currentPage = 0;

    if (!restaurantId) {
        alert('Restaurant ID가 없습니다.');
        window.location.href = "/page/owner/login"; // restaurantId 없으면 로그인
        return;
    }

    // 글쓰기 버튼 클릭
    document.getElementById("create-btn").addEventListener("click", () => {
        location.href = `/page/announcement/create?restaurantId=${restaurantId}`;
    });

    // 처음 페이지 로딩
    loadAnnouncements(currentPage);

    async function loadAnnouncements(page) {
        try {
            const response = await fetch(`/api/announcement/list?restaurantId=${restaurantId}&page=${page}&size=5`);
            if (response.ok) {
                const data = await response.json();
                renderAnnouncements(data.content);
                renderPagination(data.totalPages, page);
                currentPage = page;
            } else {
                alert('공지사항 불러오기 실패');
            }
        } catch (e) {
            console.error('에러 발생', e);
        }
    }

    function renderAnnouncements(announcements) {
        const listGroup = document.getElementById("announcement-list");
        listGroup.innerHTML = "";

        if (announcements.length === 0) {
            listGroup.innerHTML = "<p>There is no announcement</p>";
            return;
        }

        // NOTICE와 NORMAL 나누기
        const noticeList = announcements.filter(item => item.type === 'NOTICE');
        const normalList = announcements.filter(item => item.type === 'NORMAL');

        // NOTICE 먼저 렌더링
        noticeList.forEach(item => {
            const a = document.createElement("a");
            a.href = `/page/announcement/detail/${item.id}?restaurantId=${restaurantId}`;
            a.className = "list-group-item list-group-item-action announcement-notice"; // Notice 스타일
            a.innerHTML = `<strong>[Notice]</strong> ${item.title}`; // [공지] 표시 추가
            listGroup.appendChild(a);
        });

        // NORMAL 렌더링
        normalList.forEach(item => {
            const a = document.createElement("a");
            a.href = `/page/announcement/detail/${item.id}?restaurantId=${restaurantId}`;
            a.className = "list-group-item list-group-item-action announcement-normal"; // Normal 스타일
            a.textContent = item.title;
            listGroup.appendChild(a);
        });
    }


    function renderPagination(totalPages, page) {
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = "";

        // 첫 페이지로 이동
        const firstLi = document.createElement("li");
        firstLi.className = "page-item";
        const firstLink = document.createElement("a");
        firstLink.className = "page-link";
        firstLink.href = "javascript:void(0);";
        firstLink.innerHTML = "&laquo;";
        firstLink.onclick = () => loadAnnouncements(0);
        firstLi.appendChild(firstLink);
        pagination.appendChild(firstLi);

        // 이전 페이지
        const prevLi = document.createElement("li");
        prevLi.className = "page-item";
        const prevLink = document.createElement("a");
        prevLink.className = "page-link";
        prevLink.href = "javascript:void(0);";
        prevLink.innerHTML = "&lsaquo;";
        prevLink.onclick = () => {
            if (page > 0) loadAnnouncements(page - 1);
        };
        prevLi.appendChild(prevLink);
        pagination.appendChild(prevLi);

        // 페이지 번호
        for (let i = 0; i < totalPages; i++) {
            const li = document.createElement("li");
            li.className = "page-item " + (i === page ? "active" : "");
            const link = document.createElement("a");
            link.className = "page-link";
            link.href = "javascript:void(0);";
            link.textContent = (i + 1);
            link.onclick = () => loadAnnouncements(i);
            li.appendChild(link);
            pagination.appendChild(li);
        }

        // 다음 페이지
        const nextLi = document.createElement("li");
        nextLi.className = "page-item";
        const nextLink = document.createElement("a");
        nextLink.className = "page-link";
        nextLink.href = "javascript:void(0);";
        nextLink.innerHTML = "&rsaquo;";
        nextLink.onclick = () => {
            if (page < totalPages - 1) loadAnnouncements(page + 1);
        };
        nextLi.appendChild(nextLink);
        pagination.appendChild(nextLi);

        // 마지막 페이지로 이동
        const lastLi = document.createElement("li");
        lastLi.className = "page-item";
        const lastLink = document.createElement("a");
        lastLink.className = "page-link";
        lastLink.href = "javascript:void(0);";
        lastLink.innerHTML = "&raquo;";
        lastLink.onclick = () => loadAnnouncements(totalPages - 1);
        lastLi.appendChild(lastLink);
        pagination.appendChild(lastLi);
    }
});