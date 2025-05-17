'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Schedule {
  shift: string;
  shiftStartDate: string;
  shiftEndDate: string;
}

interface Employee {
  id: number;
  name: string;
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
  const [endDate, setEndDate] = useState('');

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

      const data = await res.json();
      setKitchenList(data.kitchenList || []);
      setServerList(data.serverList || []);

      const first = data.kitchenList?.[0]?.schedules?.[0];
      if (first) {
        setStartDate(first.shiftStartDate);
        setEndDate(first.shiftEndDate);
      }
    };

    fetchData();
  }, [restaurantId]);

  const colorMap: Record<string, string> = {
    FULL_TIME: 'bg-label-primary',
    DINNER: 'bg-label-info',
    LUNCH: 'bg-label-success',
    OFF: 'bg-label-warning',
  };

  const renderSelect = (value: string) => (
    <select
      className={`form-select form-select-sm form-no-border ${colorMap[value] || ''}`}
      defaultValue={value}
      disabled
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
          {schedules.map((s, idx) => <td key={idx}>{renderSelect(s.shift)}</td>)}
        </tr>
      );
    }));

  if (!restaurantId) return <p className="text-danger p-4">❌ No restaurant ID provided.</p>;

  return (
    <div className="card p-4">
      <h5 className="card-header">Schedule Edit</h5>
      <div className="mb-3">
        <label>Start Date</label>
        <input type="date" className="form-control" value={startDate} readOnly />
        <label>End Date</label>
        <input type="date" className="form-control" value={endDate} readOnly />
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

      <button className="btn btn-secondary mt-3" disabled>
        Save Changes (Only editable in client)
      </button>
    </div>
  );
}