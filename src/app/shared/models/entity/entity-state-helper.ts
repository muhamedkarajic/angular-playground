import { EntityStateFactory } from "./entity-state-factory";
import { EntityLoadFromServerFailed } from "./states/entity-load-from-server-failed";

export abstract class EntityStateHelper {
    static async requestFromServer(entityStateFactory: EntityStateFactory) {
        try {
            entityStateFactory.entityApiHub.requestEntityById(entityStateFactory.id);
        } catch (error) {
            await EntityLoadFromServerFailed.set(entityStateFactory);
        }
    }
}