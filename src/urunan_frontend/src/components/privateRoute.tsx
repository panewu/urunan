import { useEffect, useState } from "react";
import { Navigate, Route, RouteProps, useLocation } from "react-router-dom";
import { useActor } from "src/hooks/useActor";
import { AuthenticationStatus, useAuth } from "src/hooks/useAuth";

export function PrivateRoute({ children }: RouteProps) {
    const location = useLocation();
    const { authenticatedCheck } = useAuth();
    const [authStatus, setAuthStatus] = useState(AuthenticationStatus.None);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        authenticatedCheck()
            .then(state => {
                setAuthStatus(state);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading || authStatus === AuthenticationStatus.None) {
        return (<div>LOADING...</div>);
    }

    if (authStatus !== AuthenticationStatus.Ready) {
        console.log('redirect to login page', authStatus);
        const params = new URLSearchParams();
        if (location.pathname !== '/') {
            params.set('from', location.pathname);
        }
        return <Navigate to={`/login?${params.toString()}`} state={{ from: location }} replace />
    }


    return children;
}