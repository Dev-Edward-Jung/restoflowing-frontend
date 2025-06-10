'use client';

import AnnouncementDetailPage from "./Detail";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnnouncementDetailPage />
    </Suspense>
  );
}