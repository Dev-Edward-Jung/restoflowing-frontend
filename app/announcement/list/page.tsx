'use client';

import AnnouncementList from "./List";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <AnnouncementList />
        </Suspense>
      );
}