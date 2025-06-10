'use client';

import AnnouncementUpdatePage from "./Update";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <AnnouncementUpdatePage />
        </Suspense>
      );
}