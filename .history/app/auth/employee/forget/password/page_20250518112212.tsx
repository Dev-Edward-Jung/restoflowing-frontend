'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EmployeeResetPasswordPage() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const email = searchParams.get('email') || '';
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [terms, setTerms] = useState(false);
    const [error, setError] = useState('');
    const [submitDisabled, setSubmitDisabled] = useState(true);

    useEffect(() => {
        const valid = isValidPassword(password, confirm) && terms;
        setSubmitDisabled(!valid);
    }, [password, confirm, terms]);

    function isValidPassword(pw: string, confirm: string) {
        const hasNumber = /[0-9]/.test(pw);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pw);
        return pw.length > 0 && pw === confirm && hasNumber && hasSpecial;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (!email || !token) {
            setError('Invalid reset link.');
            return;
        }

        const isEmployee = pathname.includes('/employee');
        const endpoint = isEmployee ? '/api/employee/reset/password' : '/api/owner/reset/password';
        const redirectUrl = isEmployee ? '/page/employee/login?resetSuccess=true' : '/page/owner/login?resetSuccess=true';

        try {
            const res = await fetch(`${endpoint}?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const text = await res.text();

            if (res.ok) {
                alert('비밀번호가 성공적으로 재설정되었습니다.');
                router.push(redirectUrl);
            } else {
                setError(text || '비밀번호 재설정 실패');
            }
        } catch {
            setError('요청 처리 중 문제가 발생했습니다.');
        }
    }

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

                            <h4 className="mb-2">Welcome to our website</h4>
                            <p className="mb-4">Reset your password to continue</p>

                            <form onSubmit={handleSubmit} className="mb-3">
                                <input type="hidden" name="email" value={email} />
                                <input type="hidden" name="token" value={token} />

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
                                        <span className="input-group-text cursor-pointer"><i className="bx bx-hide" /></span>
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
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                        />
                                        <span className="input-group-text cursor-pointer"><i className="bx bx-hide" /></span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    {error && <div className="text-danger mb-2">{error}</div>}
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

                                <button type="submit" className="btn btn-primary d-grid w-100" disabled={submitDisabled}>
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