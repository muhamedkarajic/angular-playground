import { EntityStateFactory } from "../entity-state-factory";
import { EntityStateHelper } from "../entity-state-helper";
import { IEntity } from "../i-entity";
import { IEntityResult } from "../i-entity-result";
import { IEntityState } from "../i-entity-state";
import { EntityLoadedFromServerLockRequested } from "./entity-loaded-from-server-lock-requested";

export class EntityLoadFromStorageSucceeded implements IEntityState {
    private constructor(public entityStateFactory: EntityStateFactory, public props: IEntity) { }

    static async set(entityStateFactory: EntityStateFactory, entityPayload: IEntity): Promise<void> {
        const entityLoadedFromDB = new EntityLoadFromStorageSucceeded(entityStateFactory, entityPayload);
        entityStateFactory.state$.next(entityLoadedFromDB);
        void entityLoadedFromDB.requestFromServer();
    }

    async match(matcher: IEntityResult): Promise<void> {
        matcher.ok?.(this);
    }

    async requestFromServer(): Promise<void> {
        EntityStateHelper.requestFromServer(this.entityStateFactory);
    }

    async lock() {
        await EntityLoadedFromServerLockRequested.set(this.entityStateFactory, this.props);
    }
}
