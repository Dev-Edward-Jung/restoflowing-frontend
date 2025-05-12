document.addEventListener("DOMContentLoaded", async () => {
    // CSRF 정보 읽기
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

    loadEmployeeList(csrfToken, csrfHeader);
});

// 직원+스케줄 로드 함수 (두 개의 리스트: kitchenList, serverList)
async function loadEmployeeList(csrfToken, csrfHeader) {
    try {
        // URL에서 restaurantId 추출
        const urlParams = new URLSearchParams(window.location.search);
        const restaurantId = urlParams.get('restaurantId');
        if (!restaurantId) {
            alert('restaurantId가 URL에 없습니다');
            return;
        }

        // API 호출 : Controller에서 { kitchenList, serverList } 객체를 반환한다고 가정
        const res = await fetch(`/api/employee/schedule/list?restaurantId=${restaurantId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                [csrfHeader]: csrfToken
            }
        });
        if (!res.ok) throw new Error("데이터 가져오기 실패");

        // 응답 데이터 (예: { kitchenList: [employeeDTO,...], serverList: [employeeDTO,...] })
        const data = await res.json();
        const kitchenList = data.kitchenList || [];
        const serverList = data.serverList || [];

        // 예제: kitchenList의 첫 번째 직원의 첫 번째 스케줄에서 shiftEndDate 추출
        if (data.kitchenList && data.kitchenList.length > 0) {
            const firstEmployee = data.kitchenList[0];
            if (firstEmployee.schedules && firstEmployee.schedules.length > 0) {
                const shiftEndDate = firstEmployee.schedules[0].shiftEndDate;
                const startDateInput = firstEmployee.schedules[0].shiftStartDate;
                // HTML의 input[type="date"]는 "yyyy-MM-dd" 형식이어야 합니다.
                document.getElementById("endDateInput").value = shiftEndDate;
                document.getElementById("startDateInput").value = startDateInput;
            }
        }

        // 두 테이블의 tbody를 각각 선택하고 기존 내용을 초기화
        const kitchenTbody = document.querySelector("table.kitchen-schedule tbody");
        const serverTbody = document.querySelector("table.server-schedule tbody");
        kitchenTbody.innerHTML = "";
        serverTbody.innerHTML = "";

        // select 요소에 적용할 색상 클래스 매핑 객체
        const colorMap = {
            "FULL_TIME": "bg-label-primary",
            "DINNER": "bg-label-info",
            "LUNCH": "bg-label-success",
            "OFF": "bg-label-warning"
        };

        // kitchenList 렌더링
        kitchenList.forEach(employee => {
            // 각 직원당 2줄(tr)을 생성 (주차: week 1과 week 2)
            for (let week = 1; week <= 2; week++) {
                const tr = document.createElement("tr");
                tr.dataset.employeeId = employee.id;
                tr.dataset.memberRole = employee.memberRole;
                tr.dataset.week = week; // 주차 정보 추가

                // 첫 번째 행(week 1)에만 이름 셀 추가하고 rowspan 적용
                if (week === 1) {
                    const tdName = document.createElement("td");
                    tdName.innerHTML = `<strong>${employee.name}</strong>`;
                    tdName.rowSpan = 2; // 두 줄에 걸쳐 이름 표시
                    tr.appendChild(tdName);
                }

                // schedules 데이터가 총 14개라면: 첫 번째 행에는 인덱스 0~6, 두 번째 행에는 7~13 사용
                let weekSchedule = [];
                if (employee.schedules && employee.schedules.length === 14) {
                    weekSchedule = week === 1
                        ? employee.schedules.slice(0, 7)
                        : employee.schedules.slice(7, 14);
                } else if (employee.schedules && employee.schedules.length > 0 && Array.isArray(employee.schedules[0])) {
                    // 이미 2차원 배열(주차별)로 전달된 경우
                    weekSchedule = employee.schedules[week - 1];
                }

                // 스케줄 데이터가 있으면 해당 주의 데이터를 사용, 없으면 기본값 7개 셀 생성
                if (weekSchedule && weekSchedule.length > 0) {
                    weekSchedule.forEach(schedule => {
                        const tdSelect = document.createElement("td");
                        const selectedValue = schedule.shift || "FULL_TIME";
                        tdSelect.innerHTML = `
                            <select class="form-select form-select-sm form-no-border">
                                <option value="FULL_TIME" ${selectedValue === "FULL_TIME" ? "selected" : ""}>Full Time</option>
                                <option value="DINNER" ${selectedValue === "DINNER" ? "selected" : ""}>Dinner</option>
                                <option value="LUNCH" ${selectedValue === "LUNCH" ? "selected" : ""}>Lunch</option>
                                <option value="OFF" ${selectedValue === "OFF" ? "selected" : ""}>Off</option>
                            </select>
                        `;
                        const selectElem = tdSelect.querySelector("select");
                        selectElem.disabled = true;
                        updateSelectColor(selectElem, colorMap);
                        tr.appendChild(tdSelect);
                    });
                } else {
                    for (let i = 0; i < 7; i++) {
                        const tdSelect = document.createElement("td");
                        const selectedValue = "FULL_TIME";
                        tdSelect.innerHTML = `
                            <select class="form-select form-select-sm form-no-border">
                                <option value="FULL_TIME" ${selectedValue === "FULL_TIME" ? "selected" : ""}>Full Time</option>
                                <option value="DINNER" ${selectedValue === "DINNER" ? "selected" : ""}>Dinner</option>
                                <option value="LUNCH" ${selectedValue === "LUNCH" ? "selected" : ""}>Lunch</option>
                                <option value="OFF" ${selectedValue === "OFF" ? "selected" : ""}>Off</option>
                            </select>
                        `;
                        const selectElem = tdSelect.querySelector("select");
                        selectElem.disabled = true;
                        updateSelectColor(selectElem, colorMap);
                        tr.appendChild(tdSelect);
                    }
                }
                kitchenTbody.appendChild(tr);
            }
        });

        // serverList 렌더링
        serverList.forEach(employee => {
            for (let week = 1; week <= 2; week++) {
                const tr = document.createElement("tr");
                tr.dataset.employeeId = employee.id;
                tr.dataset.memberRole = employee.memberRole;
                tr.dataset.week = week; // 주차 정보 추가

                if (week === 1) {
                    const tdName = document.createElement("td");
                    tdName.innerHTML = `<strong>${employee.name}</strong>`;
                    tdName.rowSpan = 2;
                    tr.appendChild(tdName);
                }

                let weekSchedule = [];
                if (employee.schedules && employee.schedules.length === 14) {
                    weekSchedule = week === 1
                        ? employee.schedules.slice(0, 7)
                        : employee.schedules.slice(7, 14);
                } else if (employee.schedules && employee.schedules.length > 0 && Array.isArray(employee.schedules[0])) {
                    weekSchedule = employee.schedules[week - 1];
                }

                if (weekSchedule && weekSchedule.length > 0) {
                    weekSchedule.forEach(schedule => {
                        const tdSelect = document.createElement("td");
                        const selectedValue = schedule.shift || "FULL_TIME";
                        tdSelect.innerHTML = `
                            <select class="form-select form-select-sm form-no-border">
                                <option value="FULL_TIME" ${selectedValue === "FULL_TIME" ? "selected" : ""}>Full Time</option>
                                <option value="DINNER" ${selectedValue === "DINNER" ? "selected" : ""}>Dinner</option>
                                <option value="LUNCH" ${selectedValue === "LUNCH" ? "selected" : ""}>Lunch</option>
                                <option value="OFF" ${selectedValue === "OFF" ? "selected" : ""}>Off</option>
                            </select>
                        `;
                        const selectElem = tdSelect.querySelector("select");
                        selectElem.disabled = true;
                        updateSelectColor(selectElem, colorMap);
                        tr.appendChild(tdSelect);
                    });
                } else {
                    for (let i = 0; i < 7; i++) {
                        const tdSelect = document.createElement("td");
                        const selectedValue = "FULL_TIME";
                        tdSelect.innerHTML = `
                            <select class="form-select form-select-sm form-no-border">
                                <option value="FULL_TIME" ${selectedValue === "FULL_TIME" ? "selected" : ""}>Full Time</option>
                                <option value="DINNER" ${selectedValue === "DINNER" ? "selected" : ""}>Dinner</option>
                                <option value="LUNCH" ${selectedValue === "LUNCH" ? "selected" : ""}>Lunch</option>
                                <option value="OFF" ${selectedValue === "OFF" ? "selected" : ""}>Off</option>
                            </select>
                        `;
                        const selectElem = tdSelect.querySelector("select");
                        selectElem.disabled = true;
                        updateSelectColor(selectElem, colorMap);
                        tr.appendChild(tdSelect);
                    }
                }
                serverTbody.appendChild(tr);
            }
        });
    } catch (err) {
        console.error("Error fetching employee schedules:", err);
        alert("Failed to load employee schedules");
    }
}

// 선택된 옵션에 따라 select의 색상 클래스를 업데이트 하는 함수
function updateSelectColor(select, colorMap) {
    // 모든 색상 관련 클래스를 제거
    Object.values(colorMap).forEach(color => {
        select.classList.remove(color);
    });
    // 현재 선택된 값에 해당하는 색상 클래스를 추가
    const selectedValue = select.value;
    if (colorMap[selectedValue]) {
        select.classList.add(colorMap[selectedValue]);
    }
}

// helper: 테이블 tbody 초기화
function clearTableBodies() {
    const kitchenTbody = document.querySelector("table.kitchen-schedule tbody");
    const serverTbody = document.querySelector("table.server-schedule tbody");
    if (kitchenTbody) kitchenTbody.innerHTML = "";
    if (serverTbody) serverTbody.innerHTML = "";
}

// helper: select cell 생성 함수 (필요 시 사용)
function createSelectCell(employeeId, date, value) {
    const scheduleOptions = ["Full Time", "Dinner", "Lunch", "Off"];
    const colorMap = {
        "Full Time": "bg-label-primary",
        "Dinner": "bg-label-info",
        "Lunch": "bg-label-success",
        "Off": "bg-label-warning"
    };

    const td = document.createElement("td");
    const select = document.createElement("select");
    select.className = "form-select form-select-sm form-no-border";
    select.dataset.employeeId = employeeId;
    select.dataset.date = date;

    scheduleOptions.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        if (option === value) {
            opt.selected = true;
        }
        opt.className = `badge ${colorMap[option]} me-1`;
        select.appendChild(opt);
    });

    select.disabled = true;
    updateSelectColor(select, colorMap);

    td.appendChild(select);
    return td;
}

function updateSelectColor(select, colorMap) {
    // 모든 색상 클래스 제거
    Object.values(colorMap).forEach(color => {
        select.classList.remove(color);
    });
    // 선택된 값에 해당하는 색상 클래스 추가
    const selectedValue = select.value;
    if (colorMap[selectedValue]) {
        select.classList.add(colorMap[selectedValue]);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const restaurantId = params.get("restaurantId");

    if (!restaurantId) {
        console.log("No restaurantId found");
        return;
    }

    // 예: 특정 버튼 클릭 시 해당 URL로 이동
    document.getElementById("edit-schedule-btn").addEventListener("click", () => {
        // restaurantId를 포함한 URL로 이동
        window.location.href = "/page/employee/schedule/edit?restaurantId=" + restaurantId;
    });
});