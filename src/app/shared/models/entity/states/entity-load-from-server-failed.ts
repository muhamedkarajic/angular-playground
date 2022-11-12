import { NgxIndexedDBService } from "ngx-indexed-db";
import { lastValueFrom, timer } from "rxjs";
import { EntityStateFactory } from "../entity-state-factory";
import { IEntity } from "../i-entity";
import { IEntityState } from "../i-entity-state";
import { EntityLoadFromServerSucceeded } from "./entity-load-from-server-succeeded";
import { IEntityResult } from "../i-entity-result";

export class EntityLoadFromServerFailed implements IEntityState {
    private constructor(public entityFactory: EntityStateFactory) { }

    async match(matcher: IEntityResult): Promise<void> {
        matcher.error?.(new Error(EntityLoadFromServerFailed.constructor.name));
    }

    static async set(entityFactory: EntityStateFactory): Promise<void> {
        const entityLoadedFromServerError = new EntityLoadFromServerFailed(entityFactory);

        entityFactory.state$.next(entityLoadedFromServerError);

        timer(5000).subscribe(async () => entityLoadedFromServerError.loadFromServer(`${entityFactory.entityApiHub}/${entityFactory.id}`, entityFactory.indexDBService));
    }

    async loadFromServer(url: string, indexDBService: NgxIndexedDBService): Promise<void> {
        try {
            const name: string = await fetch(url)
                .then(response => response.json())
                .then(json => json.title);

            const entityLoadedPayload: IEntity = { id: this.entityFactory.id, name: name, version: 1 };

            await lastValueFrom(indexDBService.update<IEntity>('entities', entityLoadedPayload));

            await EntityLoadFromServerSucceeded.set(this.entityFactory, entityLoadedPayload);

        } catch (error) {
            await EntityLoadFromServerFailed.set(this.entityFactory);
        }
    }
}
