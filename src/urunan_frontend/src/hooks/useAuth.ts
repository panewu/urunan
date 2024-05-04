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
    const { username, setSelf, removeSelf } = useUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        getAUthClient().then(_ => {
            const username = getItem(K_SELF_USERNAME);
            if (username) {
                setSelf(username);
            }
        }).catch(console.error);
    }, [getItem, setSelf]);

    const login = async () => {
        setIsLoading(true);
        try {
            const authClient = await getAUthClient();
            await authClient.login({
                identityProvider: process.env.DFX_NETWORK === 'local' ?
                    `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943` : undefined
            });
            const identity = authClient.getIdentity();
            const agent = new HttpAgent({ identity });
            setActor(createActor(process.env.CANISTER_ID_URUNAN_BACKEND ?? '', { agent }));
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

    return { isLoading, login, logout, username }
};
