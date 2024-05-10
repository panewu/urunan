import { K_SELF_USER, useRehydrateUser, useUser } from "./useUser";
import { AuthClient } from "@dfinity/auth-client";
import { useLocalStorage } from "./useLocalStorage";
import { createActor, urunan_backend } from '@declarations/urunan_backend';
import { useActor } from './useActor';
import { jsonParse } from 'src/utils';

let authClient: AuthClient | null = null;

const getAUthClient = async () => {
    if (!authClient) {
        authClient = await AuthClient.create();
    }
    return authClient;
};

export enum AuthenticationStatus {
    None = "None",
    LoginRequired = "LoginRequired",
    RegistrationRequired = "RegistrationRequired",
    Ready = "Ready",
}

export const useAuth = () => {

    const { setActor } = useActor();
    const { user, setSelf, removeSelf } = useUser();
    const { validateStoredPeers, validateStoredUser } = useRehydrateUser();

    /**
     * After internet identity connected, check if user profile already registered in the backend
     * @returns AuthenticationStatus
     */
    const validateAuthStatus = async (actor: typeof urunan_backend) => {
        const userRegistered = await actor.get_my_profile();
        // console.log(userRegistered);
        let authStatus: AuthenticationStatus = AuthenticationStatus.LoginRequired;
        if (userRegistered.length > 0) {
            const user = userRegistered[0] || null;
            if (user) {
                setSelf(user);
                authStatus = AuthenticationStatus.Ready;
            } else {
                removeSelf();
                authStatus = AuthenticationStatus.RegistrationRequired;
            }
        } else {
            removeSelf();
            authStatus = AuthenticationStatus.RegistrationRequired;
        }
        return authStatus;
    };

    const authenticatedCheck = async () => {
        // rehydrate user
        validateStoredUser();
        validateStoredPeers();
        // check if identity connected
        const authClient = await getAUthClient();
        const isAuth = await authClient.isAuthenticated();
        if (!isAuth) {
            return AuthenticationStatus.LoginRequired;
        }
        // get identity & set actor (again on each browser refresh)
        const identity = authClient.getIdentity();
        const newActor = createActor(process.env.CANISTER_ID_URUNAN_BACKEND ?? '', { agentOptions: { identity } });
        setActor(newActor);
        // actor using authenticated identity is open for connection, check if registration required
        const status = await validateAuthStatus(newActor);

        return status;
    };


    /**
     * @returns AuthenticationStatus after login flow is executed
     */
    const login = async () => {
        try {
            const authStatus = await authenticatedCheck();

            if (authStatus === AuthenticationStatus.LoginRequired) {
                const authClient = await getAUthClient();
                await new Promise((resolve) => {
                    authClient.login({
                        identityProvider: process.env.DFX_NETWORK === 'local' ?
                            `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943` : undefined,
                        onSuccess: resolve
                    })
                });
                const identity = authClient.getIdentity();
                const actor = createActor(process.env.CANISTER_ID_URUNAN_BACKEND ?? '', { agentOptions: { identity } });
                setActor(actor);
                // actor using authenticated identity is open for connection, check if registration required
                return await validateAuthStatus(actor);
            }

            return authStatus;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const logout = async () => {
        try {
            removeSelf();
            const authClient = await getAUthClient();
            await authClient.logout();
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    return { login, logout, user, authenticatedCheck }
};
