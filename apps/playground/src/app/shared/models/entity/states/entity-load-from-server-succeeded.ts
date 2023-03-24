import { EntityStateFactory } from "../entity-state-factory";
import { IEntity } from "../i-entity";
import { IEntityResult } from "../i-entity-result";
import { IEntityState } from "../i-entity-state";
import { EntityLoadedFromServerLockRequested } from "./entity-loaded-from-server-lock-requested";

export class EntityLoadFromServerSucceeded implements IEntityState {
    private constructor(public entityStateFactory: EntityStateFactory, public props: IEntity) { }

    match(matcher: IEntityResult): void { }

    static async set(entityStateFactory: EntityStateFactory, payload: IEntity): Promise<void> {
        const entityLoadFromServerSucceeded = new EntityLoadFromServerSucceeded(entityStateFactory, payload);
        entityStateFactory.state$.next(entityLoadFromServerSucceeded);
    }

    async update(payload: IEntity): Promise<void> {
        const entityLoadFromServerSucceeded = new EntityLoadFromServerSucceeded(this.entityStateFactory, payload);
        this.entityStateFactory.state$.next(entityLoadFromServerSucceeded);
    }

    async lock(): Promise<void> {
        EntityLoadedFromServerLockRequested.set(this.entityStateFactory, this.props);
    }
}
