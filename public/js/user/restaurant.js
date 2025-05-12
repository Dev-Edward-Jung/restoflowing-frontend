

document.addEventListener("DOMContentLoaded", async () => {
    // ✅ CSRF 정보
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

    initRestaurantSave(csrfToken, csrfHeader);
    loadRestaurantList(csrfToken, csrfHeader);
});

// function for restaurantSave
function initRestaurantSave(csrfToken, csrfHeader) {
    const nameInput = document.querySelector(".inputName");
    const cityInput = document.querySelector(".inputCity");
    const saveBtn = document.querySelector(".saveBtn");

    // 초기 비활성화
    saveBtn.disabled = true;

    // 실시간 유효성 검사
    [nameInput, cityInput].forEach(input => {
        input.addEventListener("input", () => {
            const name = nameInput.value.trim();
            const city = cityInput.value.trim();
            saveBtn.disabled = !(name && city);
        });
    });

    // 저장 버튼 클릭 시
    saveBtn.addEventListener("click", async () => {
        const restaurantName = nameInput.value.trim();
        const restaurantCity = cityInput.value.trim();


        try {
            const res = await fetch("/api/restaurant/save", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    [csrfHeader]: csrfToken,
                },
                body: JSON.stringify({ restaurantName, restaurantCity}) // 🔥 memberId 제거됨
            });

            if (res.ok) {
                window.location.reload();
            } else {
                alert("Failed to save restaurant");
            }
        } catch (err) {
            console.error("Error saving restaurant:", err);
            alert("Error occurred");
        }
    });
}

// get Restaurant List
async function loadRestaurantList(csrfToken, csrfHeader) {
    try {
        const res = await fetch("/api/restaurant/list", {
            method: "GET", // 🔥 POST → GET으로 변경
            credentials: "include",
            headers: {
                [csrfHeader]: csrfToken
            }
        });

        if (!res.ok) throw new Error("getting list error");

        const restaurants = await res.json();
        const tbody = document.querySelector("tbody");

        restaurants.forEach((restaurant) => {
            const tr = document.createElement("tr");
            tr.classList.add("restaurant-row");
            tr.dataset.id = restaurant.id;
            tr.setAttribute("onclick", `location.href='/page/inventory/list?restaurantId=${restaurant.id}'`);

            tr.innerHTML = `
                <td><i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>${restaurant.restaurantName}</strong></td>
                <td>${restaurant.restaurantCity}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Error fetching restaurants:", err);
        alert("Fail to get your restaurant");
    }
}
