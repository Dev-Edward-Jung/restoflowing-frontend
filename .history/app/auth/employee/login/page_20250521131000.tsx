'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function EmployeeLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false)

    useEffect(() => {
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
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login/employee`,
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
        <div className="container-xxl">
            <div className="authentication-wrapper authentication-basic container-p-y">
                <div className="authentication-inner">
                    <div className="card">
                        <div className="card-body">
                            <div className="app-brand justify-content-center">
                                <Link href="/auth/employee/login" className="app-brand-link gap-2">
                                    <img src="/img/logo/logo-gray.png" className="logo-auth" alt="logo" />
                                </Link>
                            </div>
                            <h4 className="mb-2"><strong>Employee Login</strong></h4>
                            <p className="mb-4">Please sign in to your account</p>
                            <form method="POST" action="/auth/employee/login" id="formAuthentication">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="mb-3 form-password-toggle">
                                    <div className="d-flex justify-content-between">
                                        <label className="form-label" htmlFor="password">Password</label>
                                        <Link href="/auth/forget">
                                            <small>Forgot Password?</small>
                                        </Link>
                                    </div>
                                    <div className="input-group input-group-merge">
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            name="password"
                                            placeholder="********"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span className="input-group-text cursor-pointer">
                      <i className="bx bx-hide"></i>
                    </span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="remember-me"
                                            name="remember-me"
                                            checked={remember}
                                            onChange={(e) => setRemember(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="remember-me">
                                            Remember Me
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-primary d-grid w-100" type="submit">Sign in</button>
                                </div>
                            </form>
                            <p className="text-center">
                                <span>Are you owner of a restaurant ?</span>
                                <Link href="/auth/owner/login">
                                    <span>  </span><span>Owner Login</span>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
