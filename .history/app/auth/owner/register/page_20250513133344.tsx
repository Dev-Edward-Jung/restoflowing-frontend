'use client';
import { useState } from 'react';
import { useCsrf } from '../../../context/CsrfContext';

export default function OwnerRegisterPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        terms: false,
    });
    const [emailMessage, setEmailMessage] = useState('');
    const [error, setError] = useState('');
    const { token, headerName } = useCsrf();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const checkEmail = async () => {
        if (!form.email.includes('@')) {
            setEmailMessage('Invalid email format');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/owner/checkEmail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    [headerName]: token,
                },
                body: JSON.stringify({ email: form.email }),
                credentials: 'include',
            });
            const data = await res.json();
            setEmailMessage(data.used ? "You can't use this email" : "You can use this email");
        } catch {
            setEmailMessage('Error checking email');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password || !form.passwordConfirm) {
            setError('Please input everything');
            return;
        }

        if (form.password !== form.passwordConfirm) {
            setError('Password is not same');
            return;
        }

        if (!/[0-9]/.test(form.password) || !/[!@#$%^&*]/.test(form.password)) {
            setError('Password must include number and special character');
            return;
        }

        if (!form.terms) {
            setError('You must agree to the terms');
            return;
        }

        try{

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/owner`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    [headerName]: token,
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                alert('Registration successful!');
                window.location.href = "/auth/owner/login"
            } else {
                const data = await res.json();
                setError(data.message || 'Registration failed');
            }
        } catch (err: any) {
            setError('Registration error: ' + err.message);
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

                            <h4 className="mb-2">Welcome to Restoflowing.com</h4>
                            <p className="mb-4">Login and manage your business</p>

                            <form className="mb-3" onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        placeholder="Enter your username"
                                        value={form.name}
                                        onChange={handleChange}
                                        autoFocus
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={form.email}
                                        onChange={handleChange}
                                        onBlur={checkEmail}
                                    />
                                    <span className="form-text text-danger">{emailMessage}</span>
                                </div>

                                <div className="mb-3 form-password-toggle">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <div className="input-group input-group-merge">
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            name="password"
                                            placeholder="********"
                                            value={form.password}
                                            onChange={handleChange}
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
                                            value={form.passwordConfirm}
                                            onChange={handleChange}
                                        />
                                        <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div id="errorMsg" className="text-danger mb-2">{error}</div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="terms-conditions"
                                            name="terms"
                                            checked={form.terms}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="terms-conditions">
                                            I agree to <a href="#">privacy policy & terms</a>
                                        </label>
                                    </div>
                                </div>

                                <button className="btn btn-primary d-grid w-100" type="submit">Sign up</button>
                            </form>

                            <p className="text-center mt-3">
                                <span>Already have an account? </span>
                                <a href="/page/owner/login"><span>Login Instead</span></a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}