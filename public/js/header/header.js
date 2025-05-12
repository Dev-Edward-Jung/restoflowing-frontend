let restaurantId = null;

document.addEventListener("DOMContentLoaded", () => {
    // 🔹 1. restaurantId 처리
    const params = new URLSearchParams(window.location.search);
    restaurantId = params.get("restaurantId");

    if (!restaurantId) {
        alert("레스토랑 정보가 없습니다. 다시 로그인해주세요.");
        window.location.href = "/page/owner/login";
        return;
    }

    // 🔹 2. 메뉴 링크에 restaurantId 추가
    document.querySelectorAll("a.menu-link").forEach(link => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("/") && !href.startsWith("#") && !href.includes("restaurantId=")) {
            const separator = href.includes("?") ? "&" : "?";
            const newHref = `${href}${separator}restaurantId=${restaurantId}`;
            link.setAttribute("href", newHref);
        }
    });

    // 🔹 3. 권한 기반 메뉴/버튼 제어
    const roleMeta = document.querySelector('meta[name="user-role"]');
    const userRole = roleMeta ? roleMeta.content : null;

    if (userRole !== "OWNER" && userRole !== "MANAGER") {
        // 메뉴 제거
        document.querySelectorAll(".employee-list-menu").forEach(el => {
            const menuItem = el.closest(".menu-item") || el.closest("li");
            if (menuItem) menuItem.remove();
        });

        // 버튼 제거
        document.querySelectorAll(".owner-manager-only").forEach(el => el.remove());
    }
});