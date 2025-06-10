'use client';

import MyAccountPage from "./AccountPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyAccountPage />
    </Suspense>
  );
}
