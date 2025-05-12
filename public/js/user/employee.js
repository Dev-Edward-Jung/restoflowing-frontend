// ✅ CSRF 토큰 가져오기
function getCsrfInfo() {
    return {
        token: document.querySelector('meta[name="_csrf"]').getAttribute("content"),
        header: document.querySelector('meta[name="_csrf_header"]').getAttribute("content"),
    };
}

// ✅ 인벤토리 전용 컨테이너 가져오기 (없으면 생성)
function getEmployeeContainer() {
    let container = document.querySelector(".employee-list");
    if (!container) {
        // 기존 card-body 내부에 별도의 인벤토리 영역 생성 (모달 등은 card-body 내 다른 영역에 유지)
        const cardBody = document.querySelector(".card-body");
        container = document.createElement("div");
        container.className = "employee-list";
        // 인벤토리 영역을 card-body 맨 위에 추가
        cardBody.prepend(container);
    }
    return container;
}

// ✅ 서버로부터 인벤토리 리스트 불러오기
async function fetchEmployeeList(restaurantId, csrf) {
    try {
        const res = await fetch(`/api/employee/list?restaurantId=${restaurantId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                [csrf.header]: csrf.token,
            },
        });
        if (!res.ok) throw new Error("Failed to load employee");
        return await res.json();
    } catch (err) {
        console.error("Fetch employee Error:", err);
        return [];
    }
}

// ✅ 인벤토리 하나 UI로 추가 + 이벤트 바인딩
function addEmployeeToUI(employee) {
    const container = getEmployeeContainer();
    const html = `
           <input class="form-control form-control-lg large-input" disabled="" name="name" type="text" value="${employee.name}"/>
           <input class="form-control form-control-lg large-input second-input" disabled="" placeholder="Address" name="address" type="text" value="${employee.email}"/>
           <input class="form-control form-control-lg large-input second-input" disabled="" placeholder="Role" name="role" type="text" value="${employee.memberRole}"/>
  `;
    container.insertAdjacentHTML("beforeend", html);

    // 이벤트 바인딩: 마지막에 추가된 edit 버튼 선택
//     const editBtns = container.querySelectorAll(".editBtn");
//     const lastBtn = editBtns[editBtns.length - 1];
//     lastBtn.addEventListener("click", () => {
//         const modalEl = document.getElementById("modalCenter");
//         const modalInstance = new bootstrap.Modal(modalEl);
//         modalInstance.show();
//
//         // 모달의 DOM 요소(modalEl)를 사용해 내부 요소 접근
//         const inputEl = modalEl.querySelector("input.nameInput");
//         if (inputEl) {
//             inputEl.value = lastBtn.dataset.name;
//         } else {
//             console.error("❌ input.nameInput not found in modal!");
//         }
//         currentEmployeeId = lastBtn.dataset.id;
//     });
}

// ✅ UI 렌더링: 카테고리 목록을 단순 출력
function renderEmployee(employeeList) {
    const container = getEmployeeContainer();
    container.innerHTML = "";

    employeeList.forEach(addEmployeeToUI);
}

// ✅ 업데이트 API 호출
async function updateEmployee(restaurantId, csrf) {
    const data = {
        id: currentEmployeeId,
        restaurantId: restaurantId,
        name: document.querySelector("#modalCenter input.nameInput").value.trim(),
    };
    const res = await fetch("/api/employee/update", {
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
async function deleteEmployee(restaurantId, csrf) {
    const res = await fetch(`/api/employee/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type" : "application/json",
            [csrf.header]: csrf.token,
        },
        body: JSON.stringify({
            id : currentEmployeeId,
            restaurantId : restaurantId
        })
    });
    if (!res.ok) throw new Error("Delete failed");
}

// ✅ 추가 API 호출
async function addEmployee(csrf, restaurantId) {
    const name = document.querySelector("#modalCenterAdd input[name='name']").value.trim();
    const email = document.querySelector("#modalCenterAdd input[name='email']").value.trim();
    const memberRole = document.querySelector("#modalCenterAdd select.roleSelect").value;


    if (!name || !email || !memberRole) {
        alert("Please fill all fields correctly.");
        return;
    }

    const data = { name, restaurantId, email, memberRole };

    const res = await fetch("/api/employee/invite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            [csrf.header]: csrf.token,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Add failed");
}
function setupAddEmployeeFormValidation() {
    const nameInput = document.querySelector("#modalCenterAdd input[name='name']");
    const emailInput = document.querySelector("#modalCenterAdd input[name='email']");
    const emailConfirmInput = document.querySelector("#modalCenterAdd input[name='emailConfirm']");
    const roleSelect = document.querySelector("#modalCenterAdd select.roleSelect");
    const addBtn = document.querySelector("#modalCenterAdd .addBtn");

    function validateForm() {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const emailConfirm = emailConfirmInput.value.trim();
        const role = roleSelect.value;

        const isValid = name && email && emailConfirm && email === emailConfirm && role;
        addBtn.disabled = !isValid;
    }

    // 입력값 변경 시마다 validate 실행
    [nameInput, emailInput, emailConfirmInput, roleSelect].forEach(input => {
        input.addEventListener("input", validateForm);
    });

    // 모달 열릴 때도 초기 상태 설정
    validateForm();
}
// ✅ 전체 로직 초기화
async function initEmployeePage() {
    const csrf = getCsrfInfo();
    const restaurantId = new URLSearchParams(window.location.search).get("restaurantId");
    if (!restaurantId) {
        alert("Restaurant ID is missing");
        return;
    }

    const employeeList = await fetchEmployeeList(restaurantId, csrf);
    renderEmployee(employeeList);

    // 모달 내 업데이트 버튼 이벤트 (Edit Modal)
    const updateBtn = document.querySelector("#modalCenter .updateBtn");
    if (updateBtn) {
        updateBtn.addEventListener("click", async () => {
            try {
                await updateEmployee(restaurantId, csrf);
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
                await deleteEmployee(restaurantId, csrf);
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
                await addEmployee(csrf, restaurantId);
                alert("Added!");
                window.location.reload();
            } catch (err) {
                alert("Add failed");
                console.error(err);
            }
        });
    }
    setupAddEmployeeFormValidation();
}

let currentEmployeeId = null;
document.addEventListener("DOMContentLoaded", initEmployeePage);