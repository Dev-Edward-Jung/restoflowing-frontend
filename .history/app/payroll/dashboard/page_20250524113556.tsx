'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';



export default function PayrollDashboard() {
    const [name, setName] = useState('')
    const [hourlyWage, setHourlyWage] = useState(0)




    return (
        <>
        <div className="container-lg p-4">
            <div className="card mb-4">
                <h5 className="card-header">Manage Your Payroll</h5>
                <div className="card-body">
                    <div className="list-view mt-2 flex-wrap">

                    
                            <div className="border p-3 mb-3 rounded bg-light m-2">
                                <span>Name</span><input className="form-control form-control-lg large-input mb-2" disabled  />
                                <span>Hourly Wage ($)</span><input className="form-control form-control-lg large-input mb-2" disabled  />
                                <span>Total Wage ($)</span><input className="form-control form-control-lg large-input mb-2" disabled  />
                                <div className="text-end mt-3">
                                    <button
                                        className="btn btn-primary me-2"
                                        type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modalCenterAdd"
                                    >
                                        EDIT
                                    </button>

                                </div>
                            </div>


                             {/* Modal */}
                            <div className="modal fade" id="modalCenterAdd" tabIndex={-1} aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">About : </h5>
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
                                                />
                                            </div>

                                            <div className="mb-3">

                                                <label className="form-label">Hourly Wage ($)</label>
                                                    <input
                                                    className="form-control nameInput"
                                                    name="wage"
                                                    placeholder="16.5"
                                                    type="number"
                                                    
                                                />
                                                
                                            </div>

                                            <div className="modal-footer">
                                                <button className="btn btn-outline-danger" data-bs-dismiss="modal">Delete</button>
                                                <button className="btn btn-primary" data-bs-dismiss="modal">Save</button>
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