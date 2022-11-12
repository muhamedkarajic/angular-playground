import { EntityStateFactory } from "../entity-state-factory";
import { EntityStateHelper } from "../entity-state-helper";
import { IEntityResult } from "../i-entity-result";
import { IEntityState } from "../i-entity-state";

export class EntityLoadFromStorageFailed implements IEntityState {
    private constructor(public entityStateFactory: EntityStateFactory) { }

    static async set(entityStateFactory: EntityStateFactory): Promise<void> {
        const entityLoadedFromDB = new EntityLoadFromStorageFailed(entityStateFactory);
        entityStateFactory.state$.next(entityLoadedFromDB);
        void entityLoadedFromDB.requestEntityFromServer();
    }

    async match(matcher: IEntityResult): Promise<void> {
        matcher.error?.(new Error(EntityLoadFromStorageFailed.constructor.name));
    }

    async requestEntityFromServer(): Promise<void> {
        EntityStateHelper.requestFromServer(this.entityStateFactory);
    }
}
