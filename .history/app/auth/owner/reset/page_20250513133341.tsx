'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [terms, setTerms] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!password || !passwordConfirm) {
            setError('Please enter all fields');
            return;
        }

        if (password !== passwordConfirm) {
            setError('Passwords do not match');
            return;
        }

        if (!/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            setError('Password must include number and special character');
            return;
        }

        if (!terms) {
            setError('You must agree to the terms');
            return;
        }

        try {
            const res = await fetch('/api/owner/reset/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, password }),
            });

            if (res.ok) {
                setSuccess('Password successfully reset');
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('An unexpected error occurred');
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
                                    <img src="/img/logo/logo-gray.png" className="logo-auth" alt="logo" />
                                </a>
                            </div>

                            <h4 className="mb-2">Reset Your Password</h4>
                            <p className="mb-4">Please input your new password</p>

                            <form onSubmit={handleSubmit}>
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
                                        <span className="input-group-text cursor-pointer">
                      <i className="bx bx-hide"></i>
                    </span>
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
                                            value={passwordConfirm}
                                            onChange={(e) => setPasswordConfirm(e.target.value)}
                                        />
                                        <span className="input-group-text cursor-pointer">
                      <i className="bx bx-hide"></i>
                    </span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    {error && <div className="text-danger mb-2">{error}</div>}
                                    {success && <div className="text-success mb-2">{success}</div>}
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="terms-conditions"
                                            name="terms"
                                            checked={terms}
                                            onChange={(e) => setTerms(e.target.checked)}
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