'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import OwnerHeader from "@/components/header/OwnerHeader";
import { useUser } from '@/context/UserContext';


interface Schedule {
    shift: string;
    shiftStartDate: string;
    shiftEndDate: string;
}

interface Employee {
    id: number;
    name: string;
    memberRole: string;
    schedules: Schedule[] | Schedule[][];
}

export default function EmployeeScheduleClientPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [kitchenList, setKitchenList] = useState<Employee[]>([]);
    const [serverList, setServerList] = useState<Employee[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { memberId, memberRole, memberEmail } = useUser();

    useEffect(() => {
        const rid = searchParams.get('restaurantId');
        if (!rid) {
            alert("There is no Restaurant Info");
            router.push('/auth/owner/login');
            return;
        }
        setRestaurantId(rid);
    }, [searchParams, router]);

    useEffect(() => {
        async function fetchData() {
            const jwt = localStorage.getItem('jwtToken');
            if (!jwt || !restaurantId) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/schedule/list?restaurantId=${restaurantId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
                credentials: 'include',
            });

            if (!res.ok) {
                alert('❌ Failed to load schedules.');
                return;
            }

            const jsonData = await res.json();
            const data = jsonData.employees

            
            const kitchen = data.kitchenList || [];
            const server = data.serverList || [];

            setKitchenList(kitchen);
            setServerList(server);

            
            
            if (jsonData?.startDate || jsonData?.endDate) {
                setStartDate(jsonData.startDate);
                setEndDate(jsonData.endDate)
              } else {
                console.warn("⚠️ startDate and endDate is missing from response.");
                setStartDate(''); // 또는 setStartDate('') 등 안전한 값으로 초기화
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

    const renderRows = (list: Employee[]) => {
        return list.flatMap((employee) =>
            [1, 2].map((week) => {
                const isFirstRow = week === 1;
                const schedule = Array.isArray(employee.schedules?.[0])
                    ? (employee.schedules as Schedule[][])[week - 1]
                    : (employee.schedules as Schedule[]).slice((week - 1) * 7, week * 7);

                return (
                    <tr key={`${employee.id}-${week}`}>
                        {isFirstRow && <td rowSpan={2}><strong>{employee.name}</strong></td>}
                        {(schedule || []).map((s, i) => (
                            <td key={i}>
                                <select
                                    className={`form-select form-select-sm form-no-border ${colorMap[s.shift || 'FULL_TIME']}`}
                                    disabled
                                    defaultValue={s.shift || 'FULL_TIME'}
                                >
                                    <option value="FULL_TIME">Full Time</option>
                                    <option value="DINNER">Dinner</option>
                                    <option value="LUNCH">Lunch</option>
                                    <option value="OFF">Off</option>
                                </select>
                            </td>
                        ))}
                    </tr>
                );
            })
        );
    };

    if (!restaurantId) return <p className="text-danger p-4">❌ No restaurant ID provided.</p>;

    return (
        <div className='wrapper'>
             
        <div className="card p-4">
            <h5 className="card-header">Schedule List</h5>
            <div className="card-body">
                <div className="table-responsive text-nowrap text-primary mb-3">
                    <div className="input-group-sm list-view">
                        <span className="mt-3">
                          Start Date: <input type="date" className="form-control" value={startDate} disabled />
                        </span>
                        <span className="mt-3 m-lg-3">
                          End Date: <input type="date" className="form-control" value={endDate} disabled />
                        </span>
                    </div>
                </div>

                <div className="table-responsive text-nowrap">
                    <p>Kitchen Schedule</p>
                    <table className="table table-bordered kitchen-schedule">
                        <thead>
                        <tr>
                            <th>Name</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th>
                        </tr>
                        </thead>
                        <tbody>{renderRows(kitchenList)}</tbody>
                    </table>
                </div>

                <div className="table-responsive text-nowrap mt-5">
                    <p>Server Schedule</p>
                    <table className="table table-bordered server-schedule">
                        <thead>
                        <tr>
                            <th>Name</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th>
                        </tr>
                        </thead>
                        <tbody>{renderRows(serverList)}</tbody>
                    </table>
                </div>
                {
                    (memberRole == 'OWNER' || memberRole == 'MANAGER') && (
                    <a href={`/schedule/edit?restaurantId=${restaurantId}`} className="btn btn-primary mt-3 owner-manager-only">
                    Edit Schedule
                </a>
                  )}

            </div>
        </div>
        </div>
    );
}