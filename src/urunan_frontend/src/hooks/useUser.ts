import { useContext, useState } from "react";
import { AppContext } from "../context";
import { useLocalStorage } from "./useLocalStorage";
import { User } from "@declarations/urunan_backend/urunan_backend.did";
import { jsonParse, jsonStringify } from "src/utils";
import { urunan_backend } from "@declarations/urunan_backend";
import { profile } from "console";

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

    const myProfile = async () => {
        const profile = await actor.get_my_profile();
        console.log(profile[0]?.username);
        return profile[0]?.username;
    }

    return { user, setSelf, removeSelf, findUser, fetchPeers, addPeer, peers, myProfile }
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