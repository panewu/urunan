import { urunan_backend } from "@declarations/urunan_backend";
import { User } from "@declarations/urunan_backend/urunan_backend.did";
import { createContext } from "react";

interface AppContext {
    user: User | null;
    setUser: (user: User | null) => void;
    actor: typeof urunan_backend;
    setActor: (actor: typeof urunan_backend) => void;
}

export const AppContext = createContext<AppContext>({
    user: null,
    setUser: () => { },
    actor: urunan_backend,
    setActor: () => { },
});

interface NewExpenseContext {
    onSaveClicked: () => void;
    disabledSaveButton: boolean;
    setDisabledSaveButton: (disabled: boolean) => void;
}

export const NewExpenseContext = createContext<NewExpenseContext>({
    onSaveClicked: () => { },
    disabledSaveButton: true,
    setDisabledSaveButton: () => { },
});
