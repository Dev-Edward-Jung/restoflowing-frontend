// ✅ CSRF 토큰 가져오기
function getCsrfInfo() {
    return {
        token: document.querySelector('meta[name="_csrf"]').getAttribute("content"),
        header: document.querySelector('meta[name="_csrf_header"]').getAttribute("content"),
    };
}

// ✅ 인벤토리 전용 컨테이너 가져오기 (없으면 생성)
function getCategoryContainer() {
    let container = document.querySelector(".category-list");
    if (!container) {
        // 기존 card-body 내부에 별도의 인벤토리 영역 생성 (모달 등은 card-body 내 다른 영역에 유지)
        const cardBody = document.querySelector(".card-body");
        container = document.createElement("div");
        container.className = "category-list";
        // 인벤토리 영역을 card-body 맨 위에 추가
        cardBody.prepend(container);
    }
    return container;
}

// ✅ 서버로부터 인벤토리 리스트 불러오기
async function fetchCategoryList(restaurantId, csrf) {
    try {
        const res = await fetch(`/api/category/list?restaurantId=${restaurantId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                [csrf.header]: csrf.token,
            },
        });
        if (!res.ok) throw new Error("Failed to load Category");
        return await res.json();
    } catch (err) {
        console.error("Fetch Category Error:", err);
        return [];
    }
}

// ✅ 인벤토리 하나 UI로 추가 + 이벤트 바인딩
function addCategoryToUI(category) {
    const container = getCategoryContainer();
    const html = `
    <div class="mt-2 list-view" data-id="${category.id}">
      <input class="form-control form-control-lg name-input" disabled value="${category.name}" />
      <button class="btn btn-primary editBtn"
          data-id="${category.id}"
          data-name="${category.name}"
      >EDIT</button>
    </div>
  `;
    container.insertAdjacentHTML("beforeend", html);

    // 이벤트 바인딩: 마지막에 추가된 edit 버튼 선택
    const editBtns = container.querySelectorAll(".editBtn");
    const lastBtn = editBtns[editBtns.length - 1];
    lastBtn.addEventListener("click", () => {
        const modalEl = document.getElementById("modalCenter");
        const modalInstance = new bootstrap.Modal(modalEl);
        modalInstance.show();

        // 모달의 DOM 요소(modalEl)를 사용해 내부 요소 접근
        const inputEl = modalEl.querySelector("input.nameInput");
        if (inputEl) {
            inputEl.value = lastBtn.dataset.name;
        } else {
            console.error("❌ input.nameInput not found in modal!");
        }
        currentCategoryId = lastBtn.dataset.id;
    });
}

// ✅ UI 렌더링: 카테고리 목록을 단순 출력
function renderCategory(CategoryList) {
    const container = getCategoryContainer();
    container.innerHTML = "";

    CategoryList.forEach(addCategoryToUI);
}

// ✅ 업데이트 API 호출
async function updateCategory(restaurantId, csrf) {
    const data = {
        id: currentCategoryId,
        restaurantId: restaurantId,
        name: document.querySelector("#modalCenter input.nameInput").value.trim(),
    };
    const res = await fetch("/api/category/update", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            [csrf.header]: csrf.token,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Update failed");
    return data;
}

// ✅ 삭제 API 호출
async function deleteCategory(restaurantId, csrf) {
    const res = await fetch(`/api/category/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type" : "application/json",
            [csrf.header]: csrf.token,
        },
        body: JSON.stringify({
            id : currentCategoryId,
            restaurantId : restaurantId
        })
    });
    if (!res.ok) throw new Error("Delete failed");
}

// ✅ 추가 API 호출
async function addCategory(csrf, restaurantId) {
    const name = document.querySelector("#modalCenterAdd input[name='name']").value.trim();

    if (!name) {
        alert("Please fill all fields correctly.");
        return;
    }

    const data = { name, restaurantId };

    const res = await fetch("/api/category/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            [csrf.header]: csrf.token,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Add failed");
}

// ✅ 전체 로직 초기화
async function initCategoryPage() {
    const csrf = getCsrfInfo();
    const restaurantId = new URLSearchParams(window.location.search).get("restaurantId");
    if (!restaurantId) {
        alert("Restaurant ID is missing");
        return;
    }

    const CategoryList = await fetchCategoryList(restaurantId, csrf);
    renderCategory(CategoryList);

    // 모달 내 업데이트 버튼 이벤트 (Edit Modal)
    const updateBtn = document.querySelector("#modalCenter .updateBtn");
    if (updateBtn) {
        updateBtn.addEventListener("click", async () => {
            try {
                await updateCategory(restaurantId, csrf);
                alert("Updated!");
                window.location.reload();
            } catch (err) {
                alert("Update failed");
                console.error(err);
            }
        });
    }

    // 모달 내 삭제 버튼 이벤트 (Edit Modal)
    const removeBtn = document.querySelector("#modalCenter .removeBtn");
    if (removeBtn) {
        removeBtn.addEventListener("click", async () => {
            try {
                await deleteCategory(restaurantId, csrf);
                alert("Deleted!");
                window.location.reload();
            } catch (err) {
                alert("Delete failed");
                console.error(err);
            }
        });
    }

    // 추가 모달 내 추가 버튼 이벤트 (Add Modal)
    const addBtn = document.querySelector("#modalCenterAdd .addBtn");
    if (addBtn) {
        addBtn.addEventListener("click", async () => {
            try {
                await addCategory(csrf, restaurantId);
                alert("Added!");
                window.location.reload();
            } catch (err) {
                alert("Add failed");
                console.error(err);
            }
        });
    }
}

let currentCategoryId = null;
document.addEventListener("DOMContentLoaded", initCategoryPage);