'use client';

import EmployeeRegister from "./EmployeeRegister";
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeeRegister />
    </Suspense>
  );
}
