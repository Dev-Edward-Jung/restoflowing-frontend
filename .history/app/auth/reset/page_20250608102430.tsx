import dynamic from 'next/dynamic';

// 🔥 클라이언트 컴포넌트로 동적 import
const ResetPasswordPage = dynamic(() => import('./ResetPasswordPage'), {
  ssr: false,
});

export default function Page() {
  return <ResetPasswordPage />;
}