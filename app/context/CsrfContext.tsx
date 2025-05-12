// app/context/CsrfContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CsrfToken {
    token: string;
    headerName: string;
}

const CsrfContext = createContext<CsrfToken | null>(null);

export const CsrfProvider = ({ children }: { children: ReactNode }) => {
    const [csrfToken, setCsrfToken] = useState<string>('');
    const [headerName, setHeaderName] = useState<string>('X-XSRF-TOKEN');

    useEffect(() => {
        const fetchCsrf = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/csrf`, {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setCsrfToken(data.token);
                setHeaderName(data.headerName);
            }
        };
        fetchCsrf();
    }, []);

    return (
        <CsrfContext.Provider value={{ token: csrfToken, headerName }}>
            {children}
        </CsrfContext.Provider>
    );
};

export const useCsrf = () => {
    const context = useContext(CsrfContext);
    if (!context) {
        throw new Error('useCsrf must be used within a CsrfProvider');
    }
    return context;
};