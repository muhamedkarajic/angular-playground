import { EntityStateFactory } from "../entity-state-factory";
import { EntityStateHelper } from "../entity-state-helper";
import { IEntity } from "../i-entity";
import { IEntityResult } from "../i-entity-result";
import { IEntityState } from "../i-entity-state";
import { EntityLoadedFromServerLockRequested } from "./entity-loaded-from-server-lock-requested";

export class EntityLoadFromStorageSucceeded implements IEntityState {
    private constructor(public entityStateFactory: EntityStateFactory, public props: IEntity) { }

    static set(entityStateFactory: EntityStateFactory, entityPayload: IEntity): void {
        const entityLoadedFromDB = new EntityLoadFromStorageSucceeded(entityStateFactory, entityPayload);
        entityStateFactory.state$.next(entityLoadedFromDB);
        entityLoadedFromDB.requestFromServer();
    }

    match(matcher: IEntityResult): void {
        matcher.ok?.(this);
    }

    requestFromServer(): void {
        EntityStateHelper.requestFromServer(this.entityStateFactory);
    }

    lock() {
        EntityLoadedFromServerLockRequested.set(this.entityStateFactory, this.props);
    }
}
