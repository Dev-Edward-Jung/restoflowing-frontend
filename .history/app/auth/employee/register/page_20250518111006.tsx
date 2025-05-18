'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EmployeeRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const restaurantId = searchParams.get('restaurantId') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const isPasswordValid = () => {
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasNumber && hasSpecialChar;
  };

  useEffect(() => {
    const valid =
      password &&
      passwordConfirm &&
      password === passwordConfirm &&
      isPasswordValid() &&
      agreed;

    setCanSubmit(valid);

    if (!password || !passwordConfirm) {
      setErrorMsg('Please input your password');
    } else if (!isPasswordValid()) {
      setErrorMsg('Password must include at least one number and one special character');
    } else if (password !== passwordConfirm) {
      setErrorMsg('Password is not same');
    } else if (!agreed) {
      setErrorMsg('You must agree to the privacy policy & terms');
    } else {
      setErrorMsg('');
    }
  }, [password, passwordConfirm, agreed]);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const data = {password}

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/register?token=${token}&restaurantId=${restaurantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Failed to register');
      alert('Registered successfully!');
      router.push('/auth/employee/login');
    } catch (err) {
      console.error(err);
      setErrorMsg('❌ Registration failed. Please try again.');
    }
  };

  return (
    <div className="container-xxl d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="text-center mb-4">
          <a href="/page/owner/login">
            <img src="/img/logo/logo-gray.png" className="logo-auth" alt="Logo" />
          </a>
          <h4 className="mt-3">Welcome to our website</h4>
          <p>Login and manage your business</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password Confirm</label>
            <input
              type="password"
              className="form-control"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="terms-conditions"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="terms-conditions">
              I agree to <a href="#">privacy policy & terms</a>
            </label>
          </div>

          {errorMsg && <div className="text-danger mb-3">{errorMsg}</div>}

          <button type="submit" className="btn btn-primary w-100" disabled={!canSubmit}>
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}