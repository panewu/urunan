import { urunan_backend } from "@declarations/urunan_backend";
import { User } from "@declarations/urunan_backend/urunan_backend.did";
import React, { createContext } from "react";
import { SplitDebtorCandidates } from "src/model/views";

interface AppContext {
    user: User | null;
    setUser: (user: User | null) => void;
    actor: typeof urunan_backend;
    setActor: (actor: typeof urunan_backend) => void;
    peers: User[];
    setPeers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const AppContext = createContext<AppContext>({
    user: null,
    setUser: () => { },
    actor: urunan_backend,
    setActor: () => { },
    peers: [],
    setPeers: () => { },

});

interface NewExpenseContext {
    debtorCandidates: SplitDebtorCandidates[];
    setDebtorCandidates: React.Dispatch<React.SetStateAction<SplitDebtorCandidates[]>>;
}

export const NewExpenseContext = createContext<NewExpenseContext>({
    debtorCandidates: [],
    setDebtorCandidates: () => { },
});
