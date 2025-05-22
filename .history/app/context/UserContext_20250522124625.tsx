'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface UserContextType {
  memberId: string | null;
  memberEmail: string | null;
  memberRole: string | null;
}

const UserContext = createContext<UserContextType>({
  memberId: null,
  memberEmail: null,
  memberRole: null,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [memberId, setMemberId] = useState<string | null>(null);
  const [memberEmail, setMemberEmail] = useState<string | null>(null);
  const [memberRole, setMemberRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    console.log(token)
    if (!token) return;

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));

      setMemberId(decoded.id?.toString() || null);
      setMemberEmail(decoded.sub || null);
      setMemberRole(decoded.role || null);
    } catch (err) {
      console.error('Invalid JWT token', err);
      setMemberId(null);
      setMemberEmail(null);
      setMemberRole(null);
    }
  }, []);

  return (
    <UserContext.Provider value={{ memberId, memberEmail, memberRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);