import { useContext, useState } from "react";
import { AppContext } from "../context";
import { useLocalStorage } from "./useLocalStorage";
import { User } from "@declarations/urunan_backend/urunan_backend.did";
import { jsonStringify } from "src/utils";

export const K_SELF_USER = 'self_user';

export const appStateUser = () => {
    const [user, setUser] = useState<User | null>(null);
    return { user, setUser };
};

export const useUser = () => {

    const { setItem } = useLocalStorage();
    const { user, setUser } = useContext(AppContext);

    const setSelf = (user: User) => {
        setUser(user);
        setItem(K_SELF_USER, jsonStringify(user));
    };

    const removeSelf = () => {
        setUser(null);
        setItem(K_SELF_USER, '');
    };

    return { user, setSelf, removeSelf }
};