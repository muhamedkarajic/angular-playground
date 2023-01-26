import { EntityLoadFromServerSucceeded } from "./states/entity-load-from-server-succeeded";
import { EntityLoadFromStorageSucceeded } from "./states/entity-load-from-storage-succeeded";
import { EntityLoadedFromServerLockRequested } from "./states/entity-loaded-from-server-lock-requested";
import { EntityLoadedFromServerLocked } from "./states/entity-loaded-from-server-locked";
import { EntityUndefined } from "./states/entity-undefined";

export interface IEntityResult {
    all?: (entity: IEntityResult) => void;
    ok?: (entity: EntityLoadFromStorageSucceeded | EntityLoadFromServerSucceeded | EntityLoadedFromServerLockRequested | EntityLoadedFromServerLocked) => void;
    loading?: (entity: EntityUndefined) => void;
    undefined?: () => void;
    error?: (error: Error) => void;
}
