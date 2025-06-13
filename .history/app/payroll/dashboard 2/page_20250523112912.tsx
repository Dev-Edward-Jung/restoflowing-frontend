'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';



export default function PayrollDashboard() {


    return (
        <>
        <div className="container-lg p-4">
            <div className="card mb-4">
                <h5 className="card-header">Employee List</h5>
                <div className="card-body">
                    <div className="list-view mt-2 flex-wrap">

                    
                            <div className="border p-3 mb-3 rounded bg-light m-2">
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
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
                                                />
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