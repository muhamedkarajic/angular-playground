import { EntityStateFactory } from "./entity-state-factory";
import { IEntityResult } from "./i-entity-result";

export interface IEntityState {
    readonly entityStateFactory: EntityStateFactory;
    match(matcher: IEntityResult): void;
}
