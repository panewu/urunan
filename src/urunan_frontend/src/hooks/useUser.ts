import { useContext, useState } from "react";
import { AppContext } from "../context";
import { useLocalStorage } from "./useLocalStorage";
import { User } from "@declarations/urunan_backend/urunan_backend.did";
import { jsonStringify } from "src/utils";
import { urunan_backend } from "@declarations/urunan_backend";

export const K_SELF_USER = 'self_user';

export const appStateUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [peers, setPeers] = useState<User[]>([]);
    return { user, setUser, peers, setPeers };
};

export const useUser = () => {

    const { setItem } = useLocalStorage();
    const { user, setUser, actor, setPeers, peers } = useContext(AppContext);

    const setSelf = (user: User) => {
        setUser(user);
        setItem(K_SELF_USER, jsonStringify(user));
    };

    const removeSelf = () => {
        setUser(null);
        setItem(K_SELF_USER, '');
    };

    // return
    const findUser = async (username: string) => {
        const user = await actor.find_user(username);
        return user;
    }

    // set state
    const fetchPeers = async () => {
        const peers = await actor.get_peers();
        setPeers(peers);
    }

    const addPeer = async (username: string) => {
        const userRelation = await actor.connect_with_user(username);
        console.log("user relation after adding peer:", userRelation);
    }

    return { user, setSelf, removeSelf, findUser, fetchPeers, addPeer, peers }
};
