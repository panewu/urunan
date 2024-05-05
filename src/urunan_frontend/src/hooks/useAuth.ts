import { HttpAgent } from '@dfinity/agent';
import { useContext, useEffect, useState } from "react"
import { K_SELF_USERNAME, appStateUser, useUser } from "./useUser";
import { AuthClient } from "@dfinity/auth-client";
import { AppContext } from "src/context";
import { useLocalStorage } from "./useLocalStorage";
import { createActor } from '@declarations/urunan_backend';
import { useActor } from './useActor';

let authClient: AuthClient | null = null;

const getAUthClient = async () => {
    if (!authClient) {
        authClient = await AuthClient.create();
    }
    return authClient;
};

export const useAuth = () => {

    const { getItem } = useLocalStorage();
    const { setActor } = useActor();
    const { user, setSelf, removeSelf } = useUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        getAUthClient().then(_ => {
            const user = getItem(K_SELF_USERNAME);
            if (user) {
                setSelf(JSON.parse(user));
            }
        }).catch(console.error);
    }, [getItem, setSelf]);

    /**
     * @returns registerRequired
     */
    const login = async () => {
        setIsLoading(true);
        try {
            const authClient = await getAUthClient();
            await new Promise((resolve) => {
                authClient.login({
                    identityProvider: process.env.DFX_NETWORK === 'local' ?
                        `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943` : undefined,
                    onSuccess: resolve
                })
            });
            const identity = authClient.getIdentity();
            const agent = new HttpAgent({ identity });
            const actor = createActor(process.env.CANISTER_ID_URUNAN_BACKEND ?? '', { agent });
            setActor(actor);

            // set profile if registered, check if my profile is registered or not
            const userRegistered = await actor.get_my_profile();
            let registerRequired = userRegistered.length === 0;
            if (userRegistered.length > 0) {
                const user = userRegistered[0] || null;
                if (user) {
                    setSelf(user);
                } else {
                    registerRequired = true;
                }
            }
            return registerRequired;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            removeSelf();
            const authClient = await getAUthClient();
            await authClient.logout();
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const isAuthenticated = async () => {
        const authClient = await getAUthClient();
        return authClient.isAuthenticated();
    };

    return { isLoading, login, logout, user, isAuthenticated }
};
