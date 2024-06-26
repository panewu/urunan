import { redirect, useActionData, useLocation, useNavigate } from "react-router-dom";
import { AuthenticationStatus, useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { useActor } from "src/hooks/useActor";

export function Login() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const from = params.get("from") || "/";
    const navigate = useNavigate();

    const { login, logout, authenticatedCheck } = useAuth();
    const { actor } = useActor();
    const [showRegistration, setShowRegistration] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // hack for https://github.com/remix-run/react-router/issues/11240
    const [shouldNavigateBack, setShouldNavigateBack] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        authenticatedCheck()
            .then((status) => {
                setShowRegistration(status === AuthenticationStatus.RegistrationRequired);
                if (status === AuthenticationStatus.Ready) {
                    navigate(from);
                }
            }).catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (shouldNavigateBack) {
            setShouldNavigateBack(false);
            navigate(from, { replace: true });
        }
    }, [shouldNavigateBack]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        const username = d.get('username') as string;
        const usernameAvailable = await actor.is_username_available(username);
        if (usernameAvailable) {
            await actor.new_user({
                username,
                full_name: d.get('fullname') as string,
                created_at: BigInt(0),
                avatar: '',
            });
            setShouldNavigateBack(true);
        } else {
            console.error('username unavailable');
        }
    };

    const onLoginClicked = async (e: any) => {
        e.preventDefault();
        try {
            const status = await login();
            const shouldRegister = status === AuthenticationStatus.RegistrationRequired;
            setShowRegistration(shouldRegister);
            if (!shouldRegister) {
                setShouldNavigateBack(true);
            }
        } catch (err) { }
    };

    const onChangeAccountClicked = async (e: any) => {
        e.preventDefault();
        try {
            await logout();
        } catch (err) { }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-400">
            <div className="p-12 border-black border-2 rounded-md shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-gray-100">
                <div className="flex flex-col justify-center items-center mb-32">
                    <h1 className="text-lime-900 text-5xl font-black bg-lime-500 border-black border-2 p-2.5">URUNAN</h1>
                    <p className="text-lime-900 font-semibold">by panewu</p>
                </div>
                <div className="flex flex-col">
                    {
                        !showRegistration ?
                            <button
                                onClick={onLoginClicked}
                                disabled={isLoading}
                                className="h-12 border-black border-2 p-2.5 bg-lime-500 hover:bg-lime-600 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-lime-700"
                            >
                                LOGIN
                            </button>
                            :
                            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                                <input
                                    name="username"
                                    className=
                                    "border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-emerald-100 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                                    placeholder="username"
                                />
                                <input
                                    name="fullname"
                                    className=
                                    "border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-emerald-100 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                                    placeholder="Full Name"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-12 border-black border-2 p-2.5 bg-lime-500 hover:bg-lime-600 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-lime-700"
                                >
                                    REGISTER
                                </button>
                                <button
                                    onClick={onChangeAccountClicked}
                                    disabled={isLoading}
                                    className="h-12 border-black border-2 p-2.5 bg-emerald-500 hover:bg-emerald-600 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-emerald-700">
                                    Use another account?
                                </button>
                            </form>
                    }
                </div>

            </div>
        </div>

    );
}