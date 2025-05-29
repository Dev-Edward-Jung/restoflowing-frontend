import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
  sub: string;
  role: 'OWNER' | 'MANAGER' | 'EMPLOYEE';
  id: number;
  exp: number;
};

const getUserRole = (): JwtPayload['role'] | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('jwtToken');
  if (!token) return null;

  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
    return decoded.role;
  } catch (e) {
    console.error('Invalid JWT token', e);
    return null;
  }
};