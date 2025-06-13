'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface Employee {
  id: number;
  name: string;
  hourlyWage: string;
  totalWage: string | null;
}

export default function PayrollDashboard() {
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const router = useRouter();
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
          Authorization: `Bearer ${jwt}`,
        },
      });

      const json = await res.json();
      const data = json.data;

      if (Array.isArray(data)) {
        setEmployeeList(data);
      } else {
        console.error("Invalid payroll data:", data);
      }
    };

    fetchPayroll();
  }, [restaurantId]);

  const updatePayroll = async () => {
    if (!selectedEmployee) return;

    const jwt = getJwt();
    if (!jwt) {
      router.push('/auth/owner/login');
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payroll/update?restaurantId=${restaurantId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedEmployee),
    });

    const json = await res.json();
    const updated: Employee = json.data;

    // 해당 직원만 업데이트
    setEmployeeList((prevList) =>
      prevList.map((emp) => (emp.id === updated.id ? updated : emp))
    );
  };

  return (
    <div className="container-lg p-4">
      <div className="card mb-4">
        <h5 className="card-header">Manage Your Payroll</h5>
        <div className="card-body">
          <div className="list-view mt-2 flex-wrap">
            {employeeList.map((emp) => (
              <div key={emp.id} className="border p-3 mb-3 rounded bg-light m-2">
                <span>Name</span>
                <input className="form-control mb-2" disabled value={emp.name} />
                <span>Hourly Wage ($)</span>
                <input className="form-control mb-2" disabled value={emp.hourlyWage} />
                <span>Total Wage ($)</span>
                <input className="form-control mb-2" disabled value={emp.totalWage ?? ''} />
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
                    <h5 className="modal-title">About: {selectedEmployee?.name}</h5>
                    <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        value={selectedEmployee?.name || ''}
                        onChange={(e) =>
                          setSelectedEmployee((prev) =>
                            prev ? { ...prev, name: e.target.value } : null
                          )
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Hourly Wage ($)</label>
                      <input
                        className="form-control"
                        inputMode="decimal"
                        value={selectedEmployee?.hourlyWage || ''}
                        onChange={(e) =>
                          setSelectedEmployee((prev) =>
                            prev ? { ...prev, hourlyWage: e.target.value } : null
                          )
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Total Wage ($)</label>
                      <input
                        className="form-control"
                        inputMode="decimal"
                        value={selectedEmployee?.totalWage || ''}
                        onChange={(e) =>
                          setSelectedEmployee((prev) =>
                            prev ? { ...prev, totalWage: e.target.value } : null
                          )
                        }
                      />
                    </div>

                    <div className="modal-footer">
                      <button className="btn btn-primary" data-bs-dismiss="modal" onClick={updatePayroll}>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End of Modal */}
          </div>
        </div>
      </div>
    </div>
  );
}