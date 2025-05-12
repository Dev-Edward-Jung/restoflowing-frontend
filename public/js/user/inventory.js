// ✅ CSRF 토큰 가져오기
function getCsrfInfo() {
    return {
        token: document.querySelector('meta[name="_csrf"]').getAttribute("content"),
        header: document.querySelector('meta[name="_csrf_header"]').getAttribute("content"),
    };
}

// ✅ 인벤토리 전용 컨테이너 가져오기 (없으면 생성)
function getInventoryContainer() {
    let container = document.querySelector(".inventory-list");
    if (!container) {
        // 기존 card-body 내부에 별도의 인벤토리 영역 생성 (모달 등은 card-body 내 다른 영역에 유지)
        const cardBody = document.querySelector(".card-body");
        container = document.createElement("div");
        container.className = "inventory-list";
        // 인벤토리 영역을 card-body 맨 위에 추가
        cardBody.prepend(container);
    }
    return container;
}

// ✅ 서버로부터 인벤토리 리스트 불러오기
async function fetchInventoryList(restaurantId, csrf) {
    try {
        const res = await fetch(`/api/inventory/list?restaurantId=${restaurantId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                [csrf.header]: csrf.token,
            },
        });
        if (!res.ok) throw new Error("Failed to load inventory and categories");
        const data = await res.json();
        return {
            inventoryList: data.inventoryList || [],
            categoryList: data.categoryList || [],
        };
    } catch (err) {
        console.error("Fetch Inventory Error:", err);
        return { inventoryList: [], categoryList: [] };
    }
}

// ✅ 인벤토리 하나 UI로 추가 + 이벤트 바인딩
function addInventoryToUI(inv, categoryList) {
    const container = getInventoryContainer();
    const html = `
    <div class="mt-2 list-view" data-id="${inv.id}">
      <input class="form-control form-control-lg name-input" disabled value="${inv.name}" />
      <input class="form-control form-control-lg numberInput" disabled type="number" value="${inv.quantity}" />
      <select class="form-select form-select-lg unitSelect" disabled>
        <option selected value="${inv.unit || ''}">
          ${inv.unit}
        </option>
      </select>
      <button class="btn btn-primary editBtn"
          data-id="${inv.id}"
          data-name="${inv.name}"
          data-quantity="${inv.quantity}"
          data-unit="${inv.unit}"
          data-category="${inv.categoryName ? inv.categoryId : ''}"
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

        // dynamically populate the category dropdown with values from categoryList
        const categorySelect = modalEl.querySelector("select.categorySelect");
        categorySelect.innerHTML = ""; // clear existing options
        categoryList.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;


            categorySelect.appendChild(option);
        });

        modalInstance.show();

        // 모달의 DOM 요소(modalEl)를 사용해 내부 요소 접근
        modalEl.querySelector("input.nameInput").value = lastBtn.dataset.name;
        modalEl.querySelector("input.numberInput").value = lastBtn.dataset.quantity;
        modalEl.querySelector("select.unitSelect").value = lastBtn.dataset.unit;
        modalEl.querySelector("select.categorySelect option").value = lastBtn.dataset.category

        currentInventoryId = lastBtn.dataset.id;
    });
}

// ✅ UI 렌더링: 인벤토리 목록을 카테고리별로 출력
function renderInventory(inventoryList, categoryList) {
    const container = getInventoryContainer();
    container.innerHTML = "";
    // Group inventories by category name
    const groupedInventory = inventoryList.reduce((acc, inv) => {
        const categoryName = inv.categoryName || "Uncategorized";
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(inv);
        return acc;
    }, {});

    // Sort category names alphabetically
    const sortedCategoryNames = Object.keys(groupedInventory).sort((a, b) => a.localeCompare(b));

    sortedCategoryNames.forEach(categoryName => {
        container.insertAdjacentHTML("beforeend", `
      <div class="divider">
        <div class="divider-text">${categoryName}</div>
      </div>
    `);
        groupedInventory[categoryName].forEach(inv => addInventoryToUI(inv, categoryList));
    });
}

// ✅ 업데이트 API 호출
async function updateInventory(restaurantId, csrf) {
    const data = {
        id: currentInventoryId,
        restaurantId: restaurantId,
        name: document.querySelector("#modalCenter input.nameInput").value.trim(),
        quantity: parseInt(document.querySelector("#modalCenter input.numberInput").value),
        unit: document.querySelector("#modalCenter select.unitSelect").value,
        categoryId : document.querySelector("#modalCenter select.categorySelect").value,
    };
    categoryListI = document.querySelector("#modalCenter select.categorySelect").value

    const res = await fetch("/api/inventory/update", {
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
async function deleteInventory(restaurantId, csrf) {
    const res = await fetch(`/api/inventory/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type" : "application/json",
            [csrf.header]: csrf.token,
        },
        body: JSON.stringify({
            id : currentInventoryId,
            restaurantId
        })
    });
    if (!res.ok) throw new Error("Delete failed");
}

// ✅ 추가 API 호출
async function addInventory(csrf, restaurantId) {
    const name = document.querySelector("#modalCenterAdd input[name='name']").value.trim();
    const quantity = parseInt(document.querySelector("#modalCenterAdd input[name='quantity']").value);
    const unit = document.querySelector("#modalCenterAdd select.unitSelect").value;
    const categoryId = document.querySelector("#modalCenterAdd select.categorySelect").value;

    if (!name || isNaN(quantity) || !unit || !categoryId || unit === "unit") {
        alert("Please fill all fields correctly.");
        return;
    }
    // p---------- Category Type changed. Need to fix it
    const data = { name, quantity, unit, categoryId, restaurantId };

    const res = await fetch("/api/inventory/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            [csrf.header]: csrf.token,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Add failed");
}

function setupAddInventoryFormValidation() {
    const nameInput = document.querySelector("#modalCenterAdd input[name='name']");
    const quantityInput = document.querySelector("#modalCenterAdd input[name='quantity']");
    const unitSelect = document.querySelector("#modalCenterAdd select.unitSelect");
    const categorySelect = document.querySelector("#modalCenterAdd select.categorySelect");
    const addBtn = document.querySelector("#modalCenterAdd .addBtn");

    function validateForm() {
        const name = nameInput.value.trim();
        const quantity = parseInt(quantityInput.value);
        const unit = unitSelect.value;
        const categoryId = categorySelect.value;

        const isValid =
            name.length > 0 &&
            !isNaN(quantity) &&
            quantity > 0 &&
            unit && unit !== "Select Unit" &&
            categoryId && categoryId !== "Select Category";

        addBtn.disabled = !isValid;
    }

    [nameInput, quantityInput, unitSelect, categorySelect].forEach(input => {
        input.addEventListener("input", validateForm);
        input.addEventListener("change", validateForm);
    });

    validateForm(); // 초기 상태 설정
}


// ✅ 전체 로직 초기화
async function initInventoryPage() {
    const csrf = getCsrfInfo();
    const restaurantId = new URLSearchParams(window.location.search).get("restaurantId");
    if (!restaurantId) {
        alert("Restaurant ID is missing");
        return;
    }

    const { inventoryList, categoryList } = await fetchInventoryList(restaurantId, csrf);
    const unitList = await fetchUnitList(csrf);

    populateUnitOptions(unitList);
    renderInventory(inventoryList, categoryList);
    populateCategoryOptions(categoryList);

    // 모달 내 업데이트 버튼 이벤트 (Edit Modal)
    document.querySelector("#modalCenter .updateBtn").addEventListener("click", async () => {
        try {
            await updateInventory(restaurantId, csrf);
            alert("Updated!");
            window.location.reload();
        } catch (err) {
            alert("Update failed");
            console.error(err);
        }
    });

    // 모달 내 삭제 버튼 이벤트 (Edit Modal)
    document.querySelector("#modalCenter .removeBtn").addEventListener("click", async () => {
        try {
            await deleteInventory(restaurantId, csrf);
            alert("Deleted!");
            window.location.reload();
        } catch (err) {
            alert("Delete failed");
            console.error(err);
        }
    });

    // 추가 모달 내 추가 버튼 이벤트 (Add Modal)
    document.querySelector("#modalCenterAdd .addBtn").addEventListener("click", async () => {
        try {
            await addInventory(csrf, restaurantId);
            alert("Added!");
            window.location.reload();
        } catch (err) {
            alert("Add failed");
            console.error(err);
        }
    });

    setupAddInventoryFormValidation()
}

let currentInventoryId = null;
document.addEventListener("DOMContentLoaded", initInventoryPage);

// ✅ 카테고리 셀렉트 박스를 모든 모달에서 채워줌


function populateCategoryOptions(categoryList) {
    const selects = document.querySelectorAll("select.categorySelect");
    selects.forEach(select => {
        select.innerHTML = ""; // 기존 옵션 비움
        const defaultOption = document.createElement("option");
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = "Select Category";
        select.appendChild(defaultOption);

        categoryList.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    });
}


// ✅ 서버에서 유닛 리스트 불러오기
async function fetchUnitList(csrf) {
    try {
        const res = await fetch(`/api/inventory/unit/list`, {
            method: "GET",
            credentials: "include",
            headers: {
                [csrf.header]: csrf.token,
            },
        });
        if (!res.ok) throw new Error("Failed to load unit list");
        return await res.json();
    } catch (err) {
        console.error("Fetch Unit List Error:", err);
        return [];
    }
}

// ✅ 유닛 셀렉트 박스를 채우기
function populateUnitOptions(unitList) {
    const selects = document.querySelectorAll("select.unitSelect");
    selects.forEach(select => {
        select.innerHTML = "";
        const defaultOption = document.createElement("option");
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = "Select Unit";
        select.appendChild(defaultOption);

        unitList.forEach(unit => {
            const option = document.createElement("option");
            option.value = unit;
            option.textContent = unit.charAt(0) + unit.slice(1).toLowerCase();
            select.appendChild(option);
        });
    });
}