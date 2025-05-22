// components/layout/AppHeader.tsx
'use client';

import { useUser } from '@/context/UserContext';
import OwnerHeader from '@/components/header/OwnerHeader';
import EmployeeHeader from '@/components/header/EmployeeHeader';
import { usePathname } from 'next/navigation';

export default function AppHeader() {
  const { memberRole } = useUser();
  const pathname = usePathname();

  // 로그인 페이지에서는 아무 헤더도 보여주지 않음
  const isLoginPage = pathname.includes('/login');

  if (isLoginPage) return null;

  if (memberRole == 'OWNER' || memberRole === "MANAGER") {
    return <OwnerHeader />
  } else {
    <EmployeeHeader />
  }

  return null;
}