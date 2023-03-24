import { EntityStateFactory } from "../entity-state-factory";
import { IEntity } from "../i-entity";
import { IEntityResult } from "../i-entity-result";
import { IEntityState } from "../i-entity-state";

export class EntityLoadedFromServerLockRequested implements IEntityState {
    private constructor(public entityStateFactory: EntityStateFactory, public props: IEntity) { }

    static set(entityStateFactory: EntityStateFactory, entityPayload: IEntity): void {
        const entityLoadedFromDB = new EntityLoadedFromServerLockRequested(entityStateFactory, entityPayload);
        entityStateFactory.state$.next(entityLoadedFromDB);
        void entityLoadedFromDB.requestLockFromServer();
    }

    match(matcher: IEntityResult): void {
        matcher.ok?.(this);
    }

    requestLockFromServer(): void {
        this.entityStateFactory.entityApiHub.lockEntityById(this.entityStateFactory.id);
    }
}
