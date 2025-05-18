'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import OwnerHeader from "@/components/header/OwnerHeader";

interface Employee {
    id: number;
    name: string;
    email: string;
    memberRole: 'MANAGER' | 'KITCHEN' | 'SERVER' | 'EMPLOYEE';
}

export default function EmployeeListPage() {
    const router = useRouter();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailConfirm, setEmailConfirm] = useState('');
    const [role, setRole] = useState('');
    const [jwt, setJwt] = useState<string | null>(null);


    const params = useSearchParams();
    const restaurantId = params.get('restaurantId');

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          router.push('/auth/owner/login');
          return;
        }
        setJwt(token);
      }, [router]);
      
      useEffect(() => {
        if (!restaurantId || !jwt) return;
      
        const fetchEmployees = async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/list?restaurantId=${restaurantId}`, {
              headers: {
                'Authorization': `Bearer ${jwt}`,
              },
            });
            if(res.ok){
                console.log("okay?")
            }
            if (!res.ok) {
                throw new Error('Failed to load employees');
            }
            const data = await res.json();
            console.log(data)
            setEmployees(data);

            
          } catch (err) {
            alert('Failed to fetch employees.');
            console.error(err);
          }
        };
      
        fetchEmployees();
      }, [restaurantId, jwt]);


    
    useEffect(() => {
        if (!restaurantId) return;
        const fetchEmployees = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/list?restaurantId=${restaurantId}`, {
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                        'Content-Type': 'application/json',
                    },
                });
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
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
             },
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
            <OwnerHeader></OwnerHeader>
        <div className="container-lg p-4">
            <div className="card mb-4">
                <h5 className="card-header">Employee List</h5>
                <div className="card-body">
                    <div className="employee-list list-view mt-2">
                        {employees.map((emp) => (
                            <div key={emp.id} className="border p-3 mb-3 rounded bg-light">
                                <input className="form-control form-control-lg large-input mb-2" disabled value={emp.name} />
                                <input className="form-control form-control-lg large-input mb-2" disabled value={emp.email} />
                                <input className="form-control form-control-lg large-input mb-2" disabled value={emp.memberRole} />
                            </div>
                        ))}
                    </div>

                    <button
                        className="btn btn-primary small-button margin-top-5 owner-manager-only mt-4"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#modalCenterAdd"
                    >
                        Invite Employee
                    </button>

                    <div className="modal fade" id="modalCenterAdd" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Invite Your Employees</h5>
                                    <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Employee Name</label>
                                        <input
                                            className="form-control nameInput"
                                            name="name"
                                            placeholder="ex) Kyle"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Employee Email</label>
                                        <input
                                            className="form-control emailInput"
                                            name="email"
                                            placeholder="abcd@gmail.com"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email Confirm</label>
                                        <input
                                            className="form-control"
                                            name="emailConfirm"
                                            placeholder="abcd@gmail.com"
                                            type="email"
                                            value={emailConfirm}
                                            onChange={(e) => setEmailConfirm(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Employee Role</label>
                                        <select
                                            className="form-select form-select-lg roleSelect"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="">Role</option>
                                            <option value="MANAGER">Manager</option>
                                            <option value="KITCHEN">Kitchen</option>
                                            <option value="SERVER">Server</option>
                                            <option value="EMPLOYEE">Employee</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-primary addBtn" data-bs-dismiss="modal" type="button" onClick={inviteEmployee}>
                                        Send Invitation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        </div>
    );
}