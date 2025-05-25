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
    const router = useRouter();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailConfirm, setEmailConfirm] = useState('');
    const [memberRole, setRole] = useState('');
    const [hourlyWage, setHourlyWage] = useState('');

    const [jwt, setJwt] = useState<string | null>(null);

    const isFormValid =
         name.trim() !== '' &&
         email.trim() !== '' &&
        email === emailConfirm &&
        memberRole !== '' &&
        /^(\d+)?(\.\d{0,2})?$/.test(hourlyWage) && // 시급 숫자 검사
        hourlyWage.trim() !== '';


    const params = useSearchParams();
    const restaurantId = params.get('restaurantId');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
      
        // 숫자 또는 소수점 2자리까지 허용
        const isValid = /^(\d+)?(\.\d{0,2})?$/.test(value);
      
        if (isValid || value === '') {
          setHourlyWage(value);
        }
      };



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




    const inviteEmployee = async () => {
        if (!restaurantId || email !== emailConfirm || !name || !email || !memberRole) {
            alert('Please fill the form correctly.');
            return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/invite`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
             },
            body: JSON.stringify({ name, email, restaurantId, hourlyWage, memberRole: memberRole }),
        });

        if (res.ok) {
            alert('Employee invited!');
        } else {
            alert('Failed to invite employee');
        }
    };

    return (
        <div className="container-lg p-4">
            <div className="card mb-4">
                <h5 className="card-header">Employee List</h5>
                <div className="card-body">
                    <div className="employee-list list-view mt-2 flex-wrap">
                        {employees.map((emp) => (
                            <div key={emp.id} className="border p-3 mb-2 rounded bg-light m-1">
                                <input className="form-control form-control-lg large-input mb-2" disabled value={emp.name} />
                                <input className="form-control form-control-lg large-input mb-2" disabled value={emp.email} />
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
                                    <div className="mb-3">
                                    <label className="form-label">Hourly Wage ($)</label>
                                                    <input
                                                    className="form-control nameInput"
                                                    inputMode="decimal"
                                                    placeholder="15.75"
                                                    value={hourlyWage}
                                                    onKeyDown={(e) => {
                                                      const allowedKeys = [
                                                        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'
                                                      ];
                                                  
                                                      const isNumber = /^[0-9]$/.test(e.key);
                                                      const isDot = e.key === '.';
                                                  
                                                      const value = e.currentTarget.value;
                                                  
                                                      // ✅ 소수점은 1번만 허용
                                                      if (isDot && value.includes('.')) {
                                                        e.preventDefault();
                                                      }
                                                  
                                                      // ✅ 숫자, 소수점, 기본 키 허용
                                                      if (!isNumber && !isDot && !allowedKeys.includes(e.key)) {
                                                        e.preventDefault();
                                                      }
                                                    }}
                                                    onChange={handleInputChange}
                                                  />
                                    </div>
                                    <div>
                                        <label className="form-label">Employee Role</label>
                                        <select
                                            className="form-select form-select-lg roleSelect"
                                            value={memberRole}
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
                                <button
                                    className="btn btn-primary addBtn"
                                    data-bs-dismiss={isFormValid ? "modal" : undefined}
                                    type="button"
                                    onClick={inviteEmployee}
                                    disabled={!isFormValid}
                                    >
                                    Send Invitation
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}