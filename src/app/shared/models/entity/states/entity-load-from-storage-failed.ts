import { NgxIndexedDBService } from "ngx-indexed-db";
import { lastValueFrom } from "rxjs";
import { EntityStateFactory } from "../entity-state-factory";
import { IEntity } from "../i-entity";
import { IEntityResult } from "../i-entity-result";
import { IEntityState } from "../i-entity-state";
import { EntityLoadFromServerSucceeded } from "./entity-load-from-server-succeeded";

export class EntityLoadFromStorageFailed implements IEntityState {
    private constructor(public entityFactory: EntityStateFactory) { }

    static async set(entityFactory: EntityStateFactory): Promise<void> {
        const entityLoadedFromDB = new EntityLoadFromStorageFailed(entityFactory);
        entityFactory.state$.next(entityLoadedFromDB);
        void entityLoadedFromDB.loadFromServer(`${entityFactory.entityApiHub}/${entityFactory.id}`, entityFactory.indexDBService);
    }

    async match(matcher: IEntityResult): Promise<void> {
        matcher.error?.(new Error(EntityLoadFromStorageFailed.constructor.name));
    }

    async loadFromServer(url: string, indexDBService: NgxIndexedDBService): Promise<void> {
        const name: string = await fetch(url)
            .then(response => response.json())
            .then(json => json.title);

        const entityLoadedPayload: IEntity = { id: '1', name: name, version: 1 };

        await lastValueFrom(indexDBService.update<IEntity>('entities', entityLoadedPayload));
        await EntityLoadFromServerSucceeded.set(this.entityFactory, entityLoadedPayload);
    }
}
