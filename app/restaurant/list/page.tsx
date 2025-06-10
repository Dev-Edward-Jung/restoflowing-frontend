'use client';

import RestaurantList from "./RestaurantList";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RestaurantList />
    </Suspense>
  );
}