import { useEffect, useState } from "react";
import { Navigate, Outlet, Route, RouteProps, useLocation } from "react-router-dom";
import { useActor } from "src/hooks/useActor";
import { AuthenticationStatus, useAuth } from "src/hooks/useAuth";

export function PrivateRoute() {
    const location = useLocation();
    const { authenticatedCheck } = useAuth();
    const [authStatus, setAuthStatus] = useState(AuthenticationStatus.None);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        authenticatedCheck()
            .then(state => {
                console.log('authenticatedCheck', state);
                setAuthStatus(state);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    if (authStatus !== AuthenticationStatus.Ready && authStatus !== AuthenticationStatus.None && !isLoading) {
        console.log('redirect to login page', authStatus);
        const params = new URLSearchParams();
        if (location.pathname !== '/') {
            params.set('from', location.pathname);
        }
        return <Navigate to={`/login?${params.toString()}`} state={{ from: location }} replace />
    }

    return (
        <div className="bg-gray-400 min-h-lvh">
            {
                (isLoading || authStatus === AuthenticationStatus.None) ?
                    <div>LOADING...</div>
                    :
                    <Outlet />
            }
        </div>
    )
}