import dynamic from 'next/dynamic';

const ResetPasswordPage = dynamic(() => import('./ResetPasswordPage'), {
  ssr: false,
});

export default function Page() {
  return <ResetPasswordPage />;
}