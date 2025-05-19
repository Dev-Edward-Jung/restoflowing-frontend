'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OwnerHeader from "@/components/header/OwnerHeader";
import { json } from 'stream/consumers';


interface Schedule {
  shift: string;
}

interface Employee {
  id: number;
  name: string;
  shiftStartDate: string;
  shiftEndDate: string;
  memberRole: string;
  schedules: Schedule[];
}

export default function ScheduleEditClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');

  const [kitchenList, setKitchenList] = useState<Employee[]>([]);
  const [serverList, setServerList] = useState<Employee[]>([]);
  const [startDate, setStartDate] = useState('');
  const [shift, setShift] = useState('');
  const [endDate, setEndDate] = useState('OFF');

  const getJwt = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('jwtToken');
  };

  useEffect(() => {
    const jwt = getJwt();
    if (!jwt) {
      router.push('/auth/owner/login');
      return;
    }

    if (!restaurantId) {
      router.push('/error');
      return;
    }

    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/employee/schedule/list?restaurantId=${restaurantId}`,
        {
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      if (!res.ok) {
        alert('Failed to fetch schedule data');
        return;
      }

      const jsonData = await res.json();
      const data = jsonData.employees;


      setKitchenList(data.kitchenList || []);
      setServerList(data.serverList || []);


      if (jsonData?.startDate || jsonData?.endDate) {
        setStartDate(jsonData.startDate);
      } else {
        console.warn("⚠️ startDate and endDate is missing from response.");
        setStartDate(''); // 또는 setStartDate('') 등 안전한 값으로 초기화
      }
    };

    fetchData();
  }, [restaurantId]);


  const handleSave = async () => {
    const jwt = getJwt();
    if (!jwt || !restaurantId) {
      alert("❌ 인증 정보 또는 restaurantId 누락");
      return;
    }
  
    // 스케줄 전체 리스트 병합
    const allEmployees = [...kitchenList, ...serverList];
  
    const payload = allEmployees.map((emp) => ({
      id: emp.id,
      memberRole: emp.memberRole,
      shiftStartDate: startDate,
      shiftEndDate: endDate,
      schedules: emp.schedules, // 14일치 스케줄
    }));
  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/employee/schedule/save?restaurantId=${restaurantId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (res.ok) {
        alert("✅ 스케줄 저장 완료!");
        router.push(`/schedule/list?restaurantId=${restaurantId}`);
      } else {
        const errorText = await res.text();
        alert("❌ 저장 실패: " + errorText);
      }
    } catch (err: any) {
      alert("❌ 네트워크 오류: " + err.message);
    }
  };


  

  const colorMap: Record<string, string> = {
    FULL_TIME: 'bg-label-primary',
    DINNER: 'bg-label-info',
    LUNCH: 'bg-label-success',
    OFF: 'bg-label-warning',
  };

  const renderSelect = (
    value: string,
    onChange: (newValue: string) => void
  ) => (
    <select
      className={`form-select form-select-sm form-no-border ${colorMap[value] || ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="FULL_TIME">Full Time</option>
      <option value="DINNER">Dinner</option>
      <option value="LUNCH">Lunch</option>
      <option value="OFF">Off</option>
    </select>
  );

  const renderTableRows = (list: Employee[]) =>
    list.flatMap((emp) => [1, 2].map((week) => {
      const baseIdx = (week - 1) * 7;
      const schedules = emp.schedules.slice(baseIdx, baseIdx + 7);

      return (
        <tr key={`${emp.id}-${week}`}>
          {week === 1 && <td rowSpan={2}><strong>{emp.name}</strong></td>}
          {schedules.map((s, idx) => <td key={idx}>{renderSelect(s.shift, setShift)}</td>)}
        </tr>
      );
    }));

  if (!restaurantId) return <p className="text-danger p-4">❌ No restaurant ID provided.</p>;

  return (
    <div className="wrapper">
    <OwnerHeader />
    <div className="card p-4">
      <h5 className="card-header">Schedule Edit</h5>
      <div className="mb-3">
        <label>Start Date</label>
        <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label>End Date</label>
        <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
      </div>

      <p>Kitchen Schedule</p>
      <table className="table table-bordered kitchen-schedule">
        <thead>
          <tr><th>Name</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr>
        </thead>
        <tbody>{renderTableRows(kitchenList)}</tbody>
      </table>

      <p className="mt-5">Server Schedule</p>
      <table className="table table-bordered server-schedule">
        <thead>
          <tr><th>Name</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr>
        </thead>
        <tbody>{renderTableRows(serverList)}</tbody>
      </table>

      <button className="btn btn-secondary mt-3" onClick={handleSave}>
        Save Changes
      </button>
    </div>
    </div>
  );
}