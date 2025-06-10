'use client';

import ResetPasswordPage from "./ResetPasswordPage";
import { Suspense } from 'react';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordPage />
      </Suspense>
    )
}
