'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PayrollDashboard() {
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
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
      setEmployeeList(json.data);
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
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: selectedEmployee.id,
        name: selectedEmployee.name,
        hourlyWage: selectedEmployee.hourlyWage,
        totalWage: selectedEmployee.totalWage,
      }),
    });

    const json = await res.json();
    setEmployeeList(json.data);
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
                <input className="form-control mb-2" disabled value={emp.totalWage} />
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
                          setSelectedEmployee({
                            ...selectedEmployee,
                            name: e.target.value,
                          })
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
                          setSelectedEmployee({
                            ...selectedEmployee,
                            hourlyWage: e.target.value,
                          })
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
                          setSelectedEmployee({
                            ...selectedEmployee,
                            totalWage: e.target.value,
                          })
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