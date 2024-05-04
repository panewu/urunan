import { useContext, useState } from "react";
import { AppContext } from "../context";
import { useLocalStorage } from "./useLocalStorage";

export const K_SELF_USERNAME = 'self_username';

export const appStateUser = () => {
    const [username, setUsername] = useState<string | null>(null);
    return { username, setUsername };
};

export const useUser = () => {

    const { setItem } = useLocalStorage();
    const { username, setUsername } = useContext(AppContext);

    const setSelf = (username: string) => {
        setUsername(username);
        setItem(K_SELF_USERNAME, username);
    };

    const removeSelf = () => {
        setUsername(null);
        setItem(K_SELF_USERNAME, '');
    };

    return { username, setSelf, removeSelf }
};