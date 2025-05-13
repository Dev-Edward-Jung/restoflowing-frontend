// app/page/employee/schedule/edit/page.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

interface Schedule {
    shift: string;
    day: string;
}

interface Employee {
    id: number;
    name: string;
    memberRole: string;
    schedules: Schedule[];
}

interface ScheduleData {
    kitchenList: Employee[];
    serverList: Employee[];
}

async function fetchScheduleData(restaurantId: string): Promise<ScheduleData> {
    const cookieHeader = headers().get('cookie') || '';
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/schedule/list?restaurantId=${restaurantId}`, {
        headers: {
            Cookie: cookieHeader,
        },
        cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch schedule data');
    return res.json();
}

export default async function ScheduleEditPage({ searchParams }: { searchParams: { restaurantId?: string } }) {
    const restaurantId = searchParams.restaurantId;
    if (!restaurantId) redirect('/error');

    const { kitchenList, serverList } = await fetchScheduleData(restaurantId);
    const first = kitchenList[0]?.schedules[0];
    const startDate = first?.shiftStartDate || '';
    const endDate = first?.shiftEndDate || '';

    const renderSelect = (value: string) => {
        const colorMap: Record<string, string> = {
            FULL_TIME: 'bg-label-primary',
            DINNER: 'bg-label-info',
            LUNCH: 'bg-label-success',
            OFF: 'bg-label-warning',
        };
        return (
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
    };

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

            <button className="btn btn-secondary mt-3" disabled>Save Changes (Only editable in client)</button>
        </div>
    );
}