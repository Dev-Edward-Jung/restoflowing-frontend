// Refactored forgot-password.js

window.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const passwordInput = document.getElementById("passwordInput");
    const passwordConfirm = document.getElementById("passwordConfirm");
    const submitBtn = document.getElementById("submitBtn");
    const errorDiv = document.getElementById("errorMsg");

    // Pre-fill token & email from URL
    const params = new URLSearchParams(window.location.search);
    document.getElementById("tokenInput").value = params.get("token") || "";
    document.getElementById("emailInput").value = params.get("email") || "";

    // Disable submit until valid
    submitBtn.disabled = true;
    [passwordInput, passwordConfirm].forEach(input =>
        input.addEventListener("input", () => {
            submitBtn.disabled = !isValidPassword(passwordInput.value, passwordConfirm.value);
        })
    );

    // Intercept form submit
    form.addEventListener("submit", event => {
        event.preventDefault();
        clearError();

        const password = passwordInput.value.trim();
        const confirm  = passwordConfirm.value.trim();

        if (!password || !confirm) {
            return showError("비밀번호를 입력하세요.");
        }
        if (password !== confirm) {
            return showError("비밀번호가 일치하지 않습니다.");
        }
        if (!isValidPassword(password, confirm)) {
            return showError("비밀번호는 특수문자와 숫자를 최소 1개 이상 포함해야 합니다.");
        }

        // Determine API endpoint and redirect based on URL
        const isEmployee = window.location.pathname.includes("/employee/");
        const apiUrl       = isEmployee ? '/api/employee/reset/password' : '/api/owner/reset/password';
        const redirectPage = isEmployee ? '/page/employee/login?resetSuccess=true' : '/page/owner/login?resetSuccess=true';

        resetPassword(apiUrl, password, redirectPage);
    });
});

/**
 * Validates password and confirmation match, length, contains number & special char
 */
function isValidPassword(pw, confirm) {
    const hasNumber    = /[0-9]/.test(pw);
    const hasSpecial   = /[!@#$%^&*(),.?":{}|<>]/.test(pw);
    return pw.length > 0 && pw === confirm && hasNumber && hasSpecial;
}

/**
 * Performs the fetch to reset password
 */
function resetPassword(endpoint, password, redirectUrl) {
    const token       = document.getElementById("tokenInput").value;
    const email       = document.getElementById("emailInput").value;
    const csrfToken   = document.querySelector('meta[name="_csrf"]').getAttribute("content");
    const csrfHeader  = document.querySelector('meta[name="_csrf_header"]').getAttribute("content");

    fetch(`${endpoint}?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            [csrfHeader]: csrfToken
        },
        body: JSON.stringify({ password })
    })
        .then(response => response.text().then(text => ({ ok: response.ok, text })))
        .then(({ ok, text }) => {
            if (ok) {
                alert("비밀번호가 성공적으로 재설정되었습니다.");
                window.location.href = redirectUrl;
            } else {
                showError(text);
            }
        })
        .catch(() => {
            showError("요청 처리 중 문제가 발생했습니다.");
        });
}

function showError(message) {
    const errorDiv = document.getElementById("errorMsg");
    errorDiv.innerText = message;
    errorDiv.style.color = "red";
}

function clearError() {
    const errorDiv = document.getElementById("errorMsg");
    errorDiv.innerText = "";
}
