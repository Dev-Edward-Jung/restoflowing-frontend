'use client';

import { Suspense } from "react";
import AnnouncementCreate from "./Create";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <AnnouncementCreate />
        </Suspense>
      );
}