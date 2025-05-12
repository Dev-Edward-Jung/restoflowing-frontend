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

async function sendContent() {
    const title = document.getElementById("basic-default-title").value;
    const content = quill.root.innerHTML;
    let type = "NORMAL";
    const selectedRadio = document.querySelector('input[name="btnradio"]:checked');

    const params = new URLSearchParams(window.location.search);
    const restaurantId = params.get("restaurantId");

    if (!restaurantId) {
        alert('레스토랑 ID가 없습니다. 다시 로그인해주세요.');
        return;
    }

    if (selectedRadio) {
        type = selectedRadio.value;
    }

    const response = await fetch(`/api/announcement/save?restaurantId=${restaurantId}`, { // 여기
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken,
        },
        body: JSON.stringify({
            title: title,
            content: content,
            type: type
        })
    });

    if (response.ok) {
        alert('Successfully saved!');
        location.href = `/page/announcement/list?restaurantId=${restaurantId}`;
    } else {
        alert('Save Error');
    }
}