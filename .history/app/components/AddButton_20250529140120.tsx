'use client';

import { useEffect, useState } from 'react';

const AddProductButton = () => {
  const [showButton, setShowButton] = useState(false);
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('JWT 디코딩 실패:', e);
      return null;
    }
  };
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const jwt = localStorage.getItem('jwtToken');
    if (!jwt) return;

    const decoded = parseJwt(jwt);
    const role = decoded?.role;

    if (role === 'OWNER' || role === 'MANAGER') {
      setShowButton(true);
    }
  }, []);

  if (!showButton) return null;

  return (
    <button className="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#addModal">
      Add Product
    </button>
  );
};

export default AddProductButton;