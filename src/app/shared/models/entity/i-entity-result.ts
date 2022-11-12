import { EntityLoadFromServerSucceeded } from "./states/entity-load-from-server-succeeded";
import { EntityLoadFromStorageSucceeded } from "./states/entity-load-from-storage-succeeded";
import { EntityLoading } from "./states/entity-loading";

export interface IEntityResult {
    all?: (entity: IEntityResult) => void;
    ok?: (entity: EntityLoadFromStorageSucceeded | EntityLoadFromServerSucceeded) => void;
    loading?: (entity: EntityLoading) => void;
    undefined?: () => void;
    error?: (error: Error) => void;
}
