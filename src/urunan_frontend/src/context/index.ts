import { urunan_backend } from "@declarations/urunan_backend";
import { createContext } from "react";

interface AppContext {
    username: string | null;
    setUsername: (username: string | null) => void;
    actor: typeof urunan_backend;
    setActor: (actor: typeof urunan_backend) => void;
}

export const AppContext = createContext<AppContext>({
    username: null,
    setUsername: () => { },
    actor: urunan_backend,
    setActor: () => { },
});
