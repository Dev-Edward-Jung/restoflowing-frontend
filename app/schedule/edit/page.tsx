'use client';

import ScheduleEditClientPage from "./ScheduleEdit";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScheduleEditClientPage />
    </Suspense>
  );
}