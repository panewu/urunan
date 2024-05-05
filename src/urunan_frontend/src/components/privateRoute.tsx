import { useEffect, useState } from "react";
import { Navigate, Route, RouteProps, useLocation } from "react-router-dom";
import { useActor } from "src/hooks/useActor";
import { useAuth } from "src/hooks/useAuth";

export function PrivateRoute({ children }: RouteProps) {
    const location = useLocation();
    const { isAuthenticated: isAuthenticatedPromise, user } = useAuth();
    const { actor } = useActor();
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        isAuthenticatedPromise()
            .then(state => setIsAuthenticated(state))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [isAuthenticatedPromise, setIsAuthenticated]);

    if (!isAuthenticated) {
        return <Navigate to='/login' state={{ from: location }} replace />
    }

    return children;
}