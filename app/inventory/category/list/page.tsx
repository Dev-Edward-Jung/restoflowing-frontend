'use client';

import { Suspense } from "react";
import CategoryPage from "./CategoryList";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryPage />
    </Suspense>
  );
}