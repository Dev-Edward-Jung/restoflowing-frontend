// employee register.js





// 전역 flag: [입력값 유효성 통과, 이메일 중복 아님 확인 완료]
const flag = [false];

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const password = document.getElementById("password");
    const passwordConfirm = document.getElementById("passwordConfirm");
    const submitBtn = document.getElementById("submitBtn");
    const errorMessage = document.getElementById("errorMsg");

    submitBtn.disabled = true;

    function validateForm() {
        const passwordVal = password.value;
        const passwordConfirmVal = passwordConfirm.value;

        // 입력 확인
        if (!passwordVal || !passwordConfirmVal) {
            errorMessage.textContent = "Please input your password";
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

        // 모든 기본 검증 통과
        errorMessage.textContent = "";
        flag[0] = true;
        updateSubmitBtn();
    }

    function updateSubmitBtn() {
        submitBtn.disabled = !(flag[0]);
    }

    // 실시간 입력 반응
    [password, passwordConfirm].forEach((input) => {
        input.addEventListener("input", validateForm);
    });

    // 제출 방지
    form.addEventListener("submit", (e) => {
        if (submitBtn.disabled) {
            e.preventDefault();
        }
    });

    // Get Token from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const restaurantId = urlParams.get('restaurantId');

    // form 안에 숨겨진 input에 값 넣기
    document.getElementById('tokenInput').value = token;
    document.getElementById('restaurantId').value = restaurantId;

});


// submit 버튼 갱신 함수는 외부에서도 접근 가능하게 분리
function updateSubmitBtn() {
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = !(flag[0]);
}