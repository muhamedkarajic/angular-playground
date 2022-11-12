import { EntityStateFactory } from "./entity-state-factory";
import { IEntityResult } from "./i-entity-result";

export interface IEntityState {
    readonly entityFactory: EntityStateFactory;
    match(matcher: IEntityResult): Promise<void>;
}