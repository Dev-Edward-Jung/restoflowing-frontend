'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [canSubmit, setCanSubmit] = useState(false);
    const [message, setMessage] = useState('');

    const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setEmail(value);
        setCanSubmit(isValidEmail(value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidEmail(email)) return;

        try {
            const res = await fetch('/api/owner/forgot/password', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: email,
            });

            if (res.ok) {
                setMessage('📩 Reset link has been sent to your email.');
            } else {
                setMessage('❌ Failed to send reset link. Please try again.');
            }
        } catch {
            setMessage('⚠️ Unexpected error occurred.');
        }
    };

    return (
        <div className="container-xxl">
            <div className="authentication-wrapper authentication-basic container-p-y">
                <div className="authentication-inner py-4">
                    <div className="card">
                        <div className="card-body">
                            <div className="app-brand justify-content-center">
                                <a href="/page/owner/login" className="app-brand-link gap-2">
                                    <img src="/img/logo/logo-gray.png" className="logo-auth" alt="logo" />
                                </a>
                            </div>

                            <h4 className="mb-2">Forgot Owner Password? 🔒</h4>
                            <p className="mb-4">
                                Enter your email and we'll send you instructions to reset your password
                            </p>

                            <form className="mb-3" onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter your email"
                                        autoFocus
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary d-grid w-100"
                                    disabled={!canSubmit}
                                >
                                    Send Reset Link
                                </button>
                            </form>

                            {message && (
                                <div className="text-center text-sm text-success mt-2">{message}</div>
                            )}

                            <div className="text-center p-2">
                                <a href="/owner/login" className="d-flex align-items-center justify-content-center">
                                    <i className="bx"></i>
                                    Back to login
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}