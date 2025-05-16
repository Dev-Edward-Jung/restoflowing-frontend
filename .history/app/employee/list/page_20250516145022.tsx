'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface Employee {
    id: number;
    name: string;
    email: string;
    memberRole: 'MANAGER' | 'KITCHEN' | 'SERVER' | 'EMPLOYEE';
}

export default function EmployeeListPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailConfirm, setEmailConfirm] = useState('');
    const [role, setRole] = useState('');

    const params = useSearchParams();
    const restaurantId = params.get('restaurantId');

    const getJwt = (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('jwtToken');
      };

    useEffect(() => {
        if (!restaurantId) return;
        const jwt = getJwt();
        if (!jwt) {
            router.push('/auth/owner/login');
            return;
        }

        const fetchEmployees = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/list?restaurantId=${restaurantId}`{
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                      },
                })
                if (!res.ok) throw new Error('Failed to load employees');
                const data = await res.json();
                setEmployees(data);
            } catch (err) {
                alert('Failed to fetch employees.');
                console.error(err);
            }
        };

        fetchEmployees();
    }, [restaurantId]);

    const inviteEmployee = async () => {
        if (!restaurantId || email !== emailConfirm || !name || !email || !role) {
            alert('Please fill the form correctly.');
            return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/invite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, restaurantId, memberRole: role }),
        });

        if (res.ok) {
            alert('Employee invited!');
            location.reload();
        } else {
            alert('Failed to invite employee');
        }
    };

    return (
        <div>
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Employee List</h2>

            <div className="space-y-2 mb-8">
                {employees.map(emp => (
                    <div key={emp.id} className="border p-4 rounded bg-gray-50">
                        <p><strong>Name:</strong> {emp.name}</p>
                        <p><strong>Email:</strong> {emp.email}</p>
                        <p><strong>Role:</strong> {emp.memberRole}</p>
                    </div>
                ))}
            </div>

            <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Invite New Employee</h3>
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full p-2 border rounded"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Confirm Email"
                        className="w-full p-2 border rounded"
                        value={emailConfirm}
                        onChange={e => setEmailConfirm(e.target.value)}
                    />
                    <select
                        className="w-full p-2 border rounded"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                    >
                        <option value="">Select Role</option>
                        <option value="MANAGER">Manager</option>
                        <option value="KITCHEN">Kitchen</option>
                        <option value="SERVER">Server</option>
                        <option value="EMPLOYEE">Employee</option>
                    </select>
                    <button onClick={inviteEmployee} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Invite
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
}
