'use client';

import EmployeeListPage from "./EmployeeListPage";
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeeListPage />
    </Suspense>
  );
}