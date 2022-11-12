import { EntityStateFactory } from "../entity-state-factory";
import { IEntity } from "../i-entity";
import { IEntityResult } from "../i-entity-result";
import { IEntityState } from "../i-entity-state";

export class EntityLoadedFromServerLockRequested implements IEntityState {
    private constructor(public entityStateFactory: EntityStateFactory, public props: IEntity) { }

    static async set(entityStateFactory: EntityStateFactory, entityPayload: IEntity): Promise<void> {
        const entityLoadedFromDB = new EntityLoadedFromServerLockRequested(entityStateFactory, entityPayload);
        entityStateFactory.state$.next(entityLoadedFromDB);
        void entityLoadedFromDB.requestLockFromServer();
    }

    async match(matcher: IEntityResult): Promise<void> {
        matcher.ok?.(this);
    }

    async requestLockFromServer(): Promise<void> {
        this.entityStateFactory.entityApiHub.lockEntityById(this.entityStateFactory.id);
    }
}
