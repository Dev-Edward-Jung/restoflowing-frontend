'use client';

import EmployeeScheduleClientPage from "./ScheduleList";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <EmployeeScheduleClientPage />
        </Suspense>
      );
}