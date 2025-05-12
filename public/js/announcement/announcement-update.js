const quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Please Work Everyday...',
    modules: {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ]
    }
});

const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');


document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const restaurantId = params.get("restaurantId");
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    if (!id || !restaurantId) {
        alert("Wrong Request");
        window.location.href = "/page/announcement/list";
        return;
    }

    try {
        const response = await fetch(`/api/announcement/detail/${id}?restaurantId=${restaurantId}`);
        if (response.ok) {
            const data = await response.json();
            console.log(data);

            // ✅ 제목 채우기
            document.getElementById("basic-default-title").value = data.title;

            // ✅ Quill 에디터 내용 채우기
            if (typeof quill !== 'undefined') {
                quill.root.innerHTML = data.content;
            }

            // ✅ 타입 라디오 버튼 선택하기
            if (data.type === 'NOTICE') {
                document.getElementById("btnradio2").checked = true;
            } else if (data.type === 'NORMAL') {
                document.getElementById("btnradio1").checked = true;
            }

        } else {
            alert("공지사항을 불러오는데 실패했습니다.");
            window.location.href = `/page/announcement/list?restaurantId=${restaurantId}`;
        }
    } catch (error) {
        console.error(error);
        alert("서버 오류가 발생했습니다.");
        window.location.href = `/page/announcement/list?restaurantId=${restaurantId}`;
    }
});



async function updateContent() {
    const content = quill.root.innerHTML;
    const title = document.getElementById("basic-default-title").value;
    const type = document.querySelector('input[name="btnradio"]:checked').value;
    const params = new URLSearchParams(window.location.search);
    const restaurantId = params.get("restaurantId");

    // 🔥 URL에서 id 추출
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    const response = await fetch(`/api/announcement/update/${id}?restaurantId=${restaurantId}`, {
        method: 'PUT',
        headers: {
            [csrfHeader]: csrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: content,
            title : title,
            type: type
        })
    });

    if (response.ok) {
        alert('Save Successfully!');
        window.location.href = `/page/announcement/detail/${id}?restaurantId=${restaurantId}`;
    } else {
        alert('Sorry something might go wrong');
    }
}


async function deleteContent() {
    const confirmed = confirm("Would you really like to delete?");
    if (!confirmed) return;

    const params = new URLSearchParams(window.location.search);
    const restaurantId = params.get("restaurantId");

    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    try {
        const response = await fetch(`/api/announcement/delete/${id}?restaurantId=${restaurantId}`, {
            method: 'DELETE',
            headers:{
                [csrfHeader]: csrfToken,
            }

    });

        if (response.ok) {
            alert("Deleted!");
            window.location.href = `/page/announcement/list?restaurantId=${restaurantId}`;
        } else {
            alert("Delete fail");
        }
    } catch (error) {
        console.error(error);
        alert("Sever Error");
    }
}