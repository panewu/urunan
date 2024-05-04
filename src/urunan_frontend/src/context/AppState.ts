import { appStateActor } from "../hooks/useActor";
import { appStateUser } from "../hooks/useUser";

export const AppState = () => {
    const { actor, setActor } = appStateActor();
    const { username, setUsername } = appStateUser();

    return {
        actor, setActor, username, setUsername,
    };
};
