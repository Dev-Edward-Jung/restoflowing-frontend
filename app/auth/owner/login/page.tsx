'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { useCsrf } from '../../../context/CsrfContext';

export default function OwnerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const { token: csrfToken, headerName } = useCsrf();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login/owner`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // [headerName]: csrfToken,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const body = await response.json();

      if (response.ok) {
        // 1) 로그인 성공 시 JWT 토큰 저장
        localStorage.setItem('jwtToken', body.token);
        // 2) 메인 페이지(또는 원하는 페이지)로 이동
        router.push('/restaurant/list');
      } else {
        // 오류 메시지 노출
        setError(body.error || body.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError((err as Error).message);
    }
  };

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body">
              <div className="app-brand justify-content-center">
                <a href="/auth/owner/login" className="app-brand-link gap-2">
                  <img
                    src="/img/logo/logo-gray.png"
                    className="logo-auth"
                    alt="Logo"
                  />
                </a>
              </div>

              <h4 className="mb-2">
                <strong>Restaurant Owner Login</strong>
              </h4>
              <p className="mb-4">Please sign in to your account</p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mb-3">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3 form-password-toggle">
                  <div className="d-flex justify-content-between">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <a href="/auth/owner/forget/password">
                      <small>Forgot Password?</small>
                    </a>
                  </div>
                  <div className="input-group input-group-merge">
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span className="input-group-text cursor-pointer">
                      <i className="bx bx-hide"></i>
                    </span>
                  </div>
                </div>

                <div className="mb-3 form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="remember-me">
                    Remember Me
                  </label>
                </div>

                <div className="mb-3">
                  <button
                    className="btn btn-primary d-grid w-100"
                    type="submit"
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <p className="text-center">
                <span>New on our platform?</span>
                <a href="/auth/owner/register">
                  <span> Create an account</span>
                </a>
              </p>
              <p className="text-center">
                <span>Are you not owner of a restaurant?</span>
                <a href="/auth/employee/login">
                  <span> Employee Login</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}