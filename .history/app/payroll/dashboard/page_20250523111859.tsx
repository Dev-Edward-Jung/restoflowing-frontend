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
                    
                            <div className="border p-3 mb-3 rounded bg-light">
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                            </div>

                            <div className="border p-3 mb-3 rounded bg-light">
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                            </div>


                            <div className="border p-3 mb-3 rounded bg-light">
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                            </div>

                            <div className="border p-3 mb-3 rounded bg-light">
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                            </div>

                            <div className="border p-3 mb-3 rounded bg-light">
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                            </div>

                            <div className="border p-3 mb-3 rounded bg-light">
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                            </div>

                            <div className="border p-3 mb-3 rounded bg-light">
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                                <input className="form-control form-control-lg large-input mb-2" disabled  />
                            </div>

                    </div>
                </div>
            </div>
        </div>
        </>
    )
}