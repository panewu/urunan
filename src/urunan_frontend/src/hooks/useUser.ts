import { useContext, useState } from "react";
import { AppContext } from "../context";
import { useLocalStorage } from "./useLocalStorage";
import { User } from "@declarations/urunan_backend/urunan_backend.did";
import { jsonParse, jsonStringify } from "src/utils";
import { urunan_backend } from "@declarations/urunan_backend";

export const K_SELF_USER = 'self_user';
export const K_PEERS = 'peers';

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
        setItem(K_PEERS, jsonStringify(peers));
    }

    const addPeer = async (username: string) => {
        const userRelation = await actor.connect_with_user(username);
        console.log("user relation after adding peer:", userRelation);
    }

    return { user, setSelf, removeSelf, findUser, fetchPeers, addPeer, peers }
};

export const useRehydrateUser = () => {
    const { getItem } = useLocalStorage();
    const { user, setUser, peers, setPeers } = useContext(AppContext);

    const validateStoredPeers = () => {
        if (peers.length) {
            return;
        }
        const peersStored = getItem(K_PEERS);
        if (peersStored) {
            setPeers(jsonParse(peersStored));
        }
    };

    const validateStoredUser = () => {
        if (!!user) {
            return;
        }
        const userStored = getItem(K_SELF_USER);
        if (userStored) {
            setUser(jsonParse(userStored));
        }
    };

    return { validateStoredUser, validateStoredPeers };
};