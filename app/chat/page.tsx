'use client';

import ChattingPage from "./ChatPage";
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChattingPage />
    </Suspense>
  );
}