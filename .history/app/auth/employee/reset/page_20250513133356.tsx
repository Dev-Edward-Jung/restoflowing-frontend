'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function EmployeeResetPassword() {
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setToken(params.get('token') || '');
        setEmail(params.get('email') || '');
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!password || password !== confirmPassword) {
            setError('Passwords do not match or are empty.');
            return;
        }
        if (!agree) {
            setError('You must agree to the privacy policy and terms.');
            return;
        }

        try {
            const res = await fetch(`/api/employee/reset/password?token=${token}&email=${email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const text = await res.text();

            if (!res.ok) {
                throw new Error(text || 'Reset failed');
            }

            alert('Password has been reset successfully.');
            window.location.href = '/page/employee/login';
        } catch (err: any) {
            setError(err.message);
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
                            <form id="registerForm" onSubmit={handleSubmit}>
                                <input type="hidden" name="token" value={token} />
                                <input type="hidden" name="email" value={email} />

                                <div className="mb-3 form-password-toggle">
                                    <label className="form-label" htmlFor="passwordInput">Password</label>
                                    <div className="input-group input-group-merge">
                                        <input
                                            type="password"
                                            id="passwordInput"
                                            className="form-control"
                                            name="password"
                                            placeholder="********"
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
                                            name="passwordConfirm"
                                            placeholder="********"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div id="errorMsg" style={{ color: 'red' }}>{error}</div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="terms-conditions"
                                            name="terms"
                                            checked={agree}
                                            onChange={(e) => setAgree(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="terms-conditions">
                                            I agree to <a href="#">privacy policy & terms</a>
                                        </label>
                                    </div>
                                </div>

                                <button className="btn btn-primary d-grid w-100" type="submit">
                                    Reset Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}