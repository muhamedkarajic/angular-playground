import { EntityStateFactory } from "../entity-state-factory";
import { IEntity } from "../i-entity";
import { IEntityResult } from "../i-entity-result";
import { IEntityState } from "../i-entity-state";

export class EntityLoadFromServerSucceeded implements IEntityState {
    private constructor(public entityFactory: EntityStateFactory, public props: IEntity) { }

    async match(matcher: IEntityResult): Promise<void> { }

    static async set(entityFactory: EntityStateFactory, payload: IEntity): Promise<void> {
        const entityLoadFromServerSucceeded = new EntityLoadFromServerSucceeded(entityFactory, payload);
        entityFactory.state$.next(entityLoadFromServerSucceeded);
    }
}
