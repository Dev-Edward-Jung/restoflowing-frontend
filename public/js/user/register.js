



// 전역 flag: [입력값 유효성 통과, 이메일 중복 아님 확인 완료]
const flag = [false, false];

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const passwordConfirm = document.getElementById("passwordConfirm");
    const email = document.getElementById("email");
    const submitBtn = document.getElementById("submitBtn");
    const errorMessage = document.getElementById("errorMsg");

    submitBtn.disabled = true;

    function validateForm() {
        const usernameVal = username.value.trim();
        const passwordVal = password.value;
        const passwordConfirmVal = passwordConfirm.value;
        const emailVal = email.value.trim();

        // 입력 확인
        if (!usernameVal || !passwordVal || !passwordConfirmVal || !emailVal) {
            errorMessage.textContent = "Please input everything";
            flag[0] = false;
            submitBtn.disabled = true;
            return;
        }

        // 비밀번호 조건 확인
        const hasNumber = /[0-9]/.test(passwordVal);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordVal);

        if (!hasNumber || !hasSpecialChar) {
            errorMessage.textContent = "Password must include at least one number and one special character";
            flag[0] = false;
            submitBtn.disabled = true;
            return;
        }

        // 비밀번호 일치 확인
        if (passwordVal !== passwordConfirmVal) {
            errorMessage.textContent = "Password is not same";
            flag[0] = false;
            submitBtn.disabled = true;
            return;
        }

        // 이메일 형식 확인
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            errorMessage.textContent = "Invalid email format";
            flag[0] = false;
            submitBtn.disabled = true;
            return;
        }

        // 모든 기본 검증 통과
        errorMessage.textContent = "";
        flag[0] = true;
        updateSubmitBtn();
    }

    function updateSubmitBtn() {
        submitBtn.disabled = !(flag[0] && flag[1]);
    }

    // 실시간 입력 반응
    [username, password, passwordConfirm, email].forEach((input) => {
        input.addEventListener("input", validateForm);
    });

    // 제출 방지
    form.addEventListener("submit", (e) => {
        if (submitBtn.disabled) {
            e.preventDefault();
        }
    });
});

async function checkEmail() {
    const emailInput = document.getElementById('email');
    const message = document.getElementById('emailMessage');
    // JS CSRF token read and
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
    const email = emailInput.value.trim();

    flag[1] = false; // 기본값 false로 초기화

    // 이메일 형식 확인
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        message.textContent = "Invalid email";
        message.style.color = "orange";
        updateSubmitBtn(); // flag[1] = false
        return;
    }

    try {
        const res = await fetch("/api/owner/checkEmail", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                [csrfHeader]: csrfToken,
            },
            body: email,
        });

        if (!res.ok) throw new Error("Server error");

        const text = await res.text();
        const isUsed = text === "true"; // 문자열로 온 걸 boolean으로 변환

        if (isUsed) {
            message.textContent = "You can't use this email";
            message.style.color = "red";
            flag[1] = false;
        } else {
            message.textContent = "You can use this email";
            message.style.color = "green";
            flag[1] = true;
        }

        updateSubmitBtn();

    } catch (err) {
        console.error(err);
        message.textContent = "Error checking email";
        message.style.color = "gray";
        flag[1] = false;
        updateSubmitBtn();
    }
}




// submit 버튼 갱신 함수는 외부에서도 접근 가능하게 분리
function updateSubmitBtn() {
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = !(flag[0] && flag[1]);
}