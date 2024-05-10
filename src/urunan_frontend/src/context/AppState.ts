import { appStateActor } from "../hooks/useActor";
import { appStateUser } from "../hooks/useUser";

export const AppState = () => {
    const { actor, setActor } = appStateActor();
    const { user, setUser, peers, setPeers } = appStateUser();

    return {
        actor, setActor, user, setUser, peers, setPeers
    };
};
