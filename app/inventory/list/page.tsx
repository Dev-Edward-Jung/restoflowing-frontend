'use client';

import InventoryPage from "./InventoryList";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InventoryPage />
    </Suspense>
  );
}