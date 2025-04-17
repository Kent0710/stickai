'use client';

import { SessionProvider } from 'next-auth/react';

interface SessionClientProviderProps {
    children : React.ReactNode
};

const SessionClientProvider : React.FC<SessionClientProviderProps> = ({
    children
}) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
};

export default SessionClientProvider;
