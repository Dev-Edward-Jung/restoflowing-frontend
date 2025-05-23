'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';



export default function PayrollDashboard() {


    return (
        <>
            <div className="container-lg p-4">
            <div className="employee-list list-view mt-2">
                                <input className="form-control form-control-lg large-input mb-2" disabled  value="youchan"/>
                                <input className="form-control form-control-lg large-input mb-2" disabled  value="15$"/>
                                <input className="form-control form-control-lg large-input mb-2" disabled value="1400$"/>
                    </div>
            </div>
        </>
    )
}