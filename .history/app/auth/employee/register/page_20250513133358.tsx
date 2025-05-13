'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function EmployeeRegister() {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [canSubmit, setCanSubmit] = useState(false);
    const searchParams = useSearchParams();

    const token = searchParams.get('token') || '';
    const restaurantId = searchParams.get('restaurantId') || '';

    useEffect(() => {
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!password || !passwordConfirm) {
            setError('Please input your password');
            setCanSubmit(false);
        } else if (!hasNumber || !hasSpecialChar) {
            setError('Password must include at least one number and one special character');
            setCanSubmit(false);
        } else if (password !== passwordConfirm) {
            setError('Password is not same');
            setCanSubmit(false);
        } else {
            setError('');
            setCanSubmit(true);
        }
    }, [password, passwordConfirm]);

    const handleSubmit = (e: React.FormEvent) => {
        if (!canSubmit) {
            e.preventDefault();
        }
    };

    return (
        <div className="container-xxl">
            <div className="authentication-wrapper authentication-basic container-p-y">
                <div className="authentication-inner">
                    <div className="card">
                        <div className="card-body">
                            <div className="app-brand justify-content-center">
                                <a href="/page/owner/login" className="app-brand-link gap-2">
                                    <img src="/img/logo/logo-gray.png" className="logo-auth" alt="Logo" />
                                </a>
                            </div>
                            <h4 className="mb-2">Welcome to our website</h4>
                            <p className="mb-4">Login and manage your business</p>

                            <form id="registerForm" className="mb-3" action="/page/employee/register" method="post" onSubmit={handleSubmit}>
                                <input type="hidden" name="restaurantId" value={restaurantId} />
                                <input type="hidden" name="token" value={token} />

                                <div className="mb-3 form-password-toggle">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <div className="input-group input-group-merge">
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            name="ownerPassword"
                                            placeholder="••••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                                    </div>
                                </div>

                                <div className="mb-3 form-password-toggle">
                                    <label className="form-label" htmlFor="passwordConfirm">Password Confirm</label>
                                    <div className="input-group input-group-merge">
                                        <input
                                            type="password"
                                            id="passwordConfirm"
                                            className="form-control"
                                            name="password"
                                            placeholder="••••••••••"
                                            value={passwordConfirm}
                                            onChange={(e) => setPasswordConfirm(e.target.value)}
                                        />
                                        <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="text-danger" id="errorMsg">{error}</div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="terms-conditions" name="terms" required />
                                        <label className="form-check-label" htmlFor="terms-conditions">
                                            I agree to <a href="#">privacy policy & terms</a>
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary d-grid w-100" disabled={!canSubmit}>Sign up</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
