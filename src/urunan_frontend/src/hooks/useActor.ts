import { urunan_backend } from "@declarations/urunan_backend";
import { useContext, useState } from "react";
import { AppContext } from "../context";

export const appStateActor = () => {
    const [actor, setActor] = useState<typeof urunan_backend>(urunan_backend);

    return { actor, setActor };
};

export const useActor = () => {
    const { actor, setActor } = useContext(AppContext);

    return { actor, setActor };
}