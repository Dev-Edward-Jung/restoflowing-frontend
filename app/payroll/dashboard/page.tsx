'use client';

import PayrollDashboard from "./PayrollList";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PayrollDashboard />
    </Suspense>
  );
}