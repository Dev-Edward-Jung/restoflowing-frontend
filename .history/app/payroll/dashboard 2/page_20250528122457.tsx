'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';


export default function PayrollDashboard() {
    const [employeeList, setEmployeeList] = useState([])
    const [name, setName] = useState('')
    const [hourlyWage, setHourlyWage] = useState('');
    const [totalWage, setTotalWage] = useState('')
    const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
    const router = useRouter()
    const searchParams = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');

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

        const fetchPayroll = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payroll/list?restaurantId=${restaurantId}`, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                  },
            });

            const json = await res.json()
            const data = json.data;
            setEmployeeList(data)
            
        }

        fetchPayroll();

    },[restaurantId]);

    const updatePayroll = async () => {
        const jwt = getJwt();
        if (!jwt) {
            router.push('/auth/owner/login');
            return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payroll/update?restaurantId=${restaurantId}`, {
            headers: {
                'Authorization': `Bearer ${jwt}`,
                method: 'PUT',
              },
            body: JSON.stringify({ name, hourlyWage, totalWage }),

        });



        const json = await res.json()
        const data = json.data;
        setEmployeeList(data)
        
    }




    return (
        <>
        <div className="container-lg p-4">
            <div className="card mb-4">
                <h5 className="card-header">Manage Your Payroll</h5>
                <div className="card-body">
                    <div className="list-view mt-2 flex-wrap">
                    {employeeList.map((emp) => (
                            <div key={emp.id} className="border p-3 mb-3 rounded bg-light m-2">
                            <span>Name</span><input className="form-control form-control-lg large-input mb-2" disabled value={emp.name}  />
                            <span>Hourly Wage ($)</span><input className="form-control form-control-lg large-input mb-2" disabled value={emp.hourlyWage}  />
                            <span>Total Wage ($)</span><input className="form-control form-control-lg large-input mb-2" disabled/>
                            <div className="text-end mt-3">
                                <button
                                    className="btn btn-primary me-2"
                                    type="button"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalCenterAdd"
                                    onClick={() => setSelectedEmployee(emp)}
                                    >
                                    EDIT
                                </button>

                            </div>
                            </div>
                        ))}


                             {/* Modal */}
                            <div className="modal fade" id="modalCenterAdd" tabIndex={-1} aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">About: {selectedEmployee?.name || ''}</h5>
                                                <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label className="form-label">Name</label>
                                                    <input
                                                    className="form-control nameInput"
                                                    name="name"
                                                    placeholder="ex) Kyle"
                                                    type="text"
                                                    value= {selectedEmployee?.name || ''}
                                                    // onChange={e => setName(e.target.value)}
                                                />
                                            </div>

                                            <div className="mb-3">

                                                <label className="form-label">Hourly Wage ($)</label>
                                                    <input
                                                    className="form-control nameInput"
                                                    inputMode="decimal"
                                                    placeholder="15.75"
                                                    value={selectedEmployee?.hourlyWage || ''}
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
                                                    onChange={e => setHourlyWage(e.target.value)}
                                                  />
                                                
                                            </div>


                                            <div className="mb-3">

                                            <label className="form-label">Total Wage ($)</label>
                                                <input
                                                    className="form-control nameInput"
                                                        inputMode="decimal"
                                                        placeholder="3200"
                                                        value= {selectedEmployee?.totalWage || ''}
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
                                            onChange={e => setTotalWage(e.target.value)}
                                />

                                    </div>

                                            <div className="modal-footer">
                                                <button className="btn btn-primary" data-bs-dismiss="modal" onClick={updatePayroll}>Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>








                        </div>
                    </div>
            </div>
        </div>
        </>
    )
}