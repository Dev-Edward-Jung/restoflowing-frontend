'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OwnerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // On mount, load saved creds if any
  useEffect(() => {
    const jwt = localStorage.getItem('jwtToken');

    const validateToken = async () => {
      if (!jwt) {
        setCheckingAuth(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });

      if (res.ok) {
        router.replace('/restaurant/list'); // 또는 /home
      } else {
        setCheckingAuth(false); // 유효하지 않음 → 로그인 폼 보여줌
      }
    };


    validateToken();

    const saved = localStorage.getItem('rememberMe') === 'true';
    if (saved) {
      const e = localStorage.getItem('rememberEmail') ?? '';
      const p = localStorage.getItem('rememberPassword') ?? '';
      setEmail(e);
      setPassword(p);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // save (or clear) creds based on rememberMe
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('rememberEmail', email);
      localStorage.setItem('rememberPassword', password);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('rememberEmail');
      localStorage.removeItem('rememberPassword');
    }

    // send login request
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login/owner`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body.error || body.message || 'Login failed');
        return;
      }

      const body = await response.json();
      localStorage.setItem('jwtToken', body.token);
      router.push('/restaurant/list');
    } catch (err) {
      console.error('Login error:', err);
      setError((err as Error).message);
    }
  };

  return (
    <div className='m-3'>
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body">
              <div className="app-brand justify-content-center">
                <a href="/auth/owner/login" className="app-brand-link gap-2">
                  <img src="/img/logo/logo-gray.png" className="logo-auth" alt="Logo" />
                </a>
              </div>

              <h4 className="mb-2"><strong>Restaurant Owner Login</strong></h4>
              <p className="mb-4">Please sign in to your account</p>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit} className="mb-3">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3 form-password-toggle">
                  <div className="d-flex justify-content-between">
                    <label htmlFor="password" className="form-label">Password</label>
                    <a href="/auth/forget"><small>Forgot Password?</small></a>
                  </div>
                  <div className="input-group input-group-merge">
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      placeholder="••••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <span className="input-group-text cursor-pointer">
                      <i className="bx bx-hide"></i>
                    </span>
                  </div>
                </div>

                <div className="mb-3 form-check">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="form-check-input"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="form-check-label">
                    Remember Me
                  </label>
                </div>

                <div className="mb-3">
                  <button className="btn btn-primary d-grid w-100" type="submit">
                    Sign in
                  </button>
                </div>
              </form>

              <p className="text-center">
                <span>New on our platform?</span>
                <a href="/auth/owner/register"><span> Create an account</span></a>
              </p>
              <p className="text-center">
                <span>Not an owner?</span>
                <a href="/auth/employee/login"><span> Employee Login</span></a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}