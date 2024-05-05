import { appStateActor } from "../hooks/useActor";
import { appStateUser } from "../hooks/useUser";

export const AppState = () => {
    const { actor, setActor } = appStateActor();
    const { user, setUser } = appStateUser();

    return {
        actor, setActor, user, setUser,
    };
};
