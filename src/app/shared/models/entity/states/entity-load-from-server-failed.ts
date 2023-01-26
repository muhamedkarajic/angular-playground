import { NgxIndexedDBService } from "ngx-indexed-db";
import { lastValueFrom, timer } from "rxjs";
import { EntityStateFactory } from "../entity-state-factory";
import { IEntity } from "../i-entity";
import { IEntityResult } from "../i-entity-result";
import { IEntityState } from "../i-entity-state";
import { EntityLoadFromServerSucceeded } from "./entity-load-from-server-succeeded";

export class EntityLoadFromServerFailed implements IEntityState {
    private constructor(public entityStateFactory: EntityStateFactory) { }

    match(matcher: IEntityResult): void {
        matcher.error?.(new Error(EntityLoadFromServerFailed.constructor.name));
    }

    static set(entityStateFactory: EntityStateFactory): void {
        const entityLoadedFromServerError = new EntityLoadFromServerFailed(entityStateFactory);

        entityStateFactory.state$.next(entityLoadedFromServerError);

        timer(5000).subscribe(async () => entityLoadedFromServerError.loadFromServer(`${entityStateFactory.entityApiHub}/${entityStateFactory.id}`, entityStateFactory.indexDBService));
    }

    async loadFromServer(url: string, indexDBService: NgxIndexedDBService): Promise<void> {
        try {
            const name: string = await fetch(url)
                .then(response => response.json())
                .then(json => json.title);

            const entityLoadedPayload: IEntity = { id: this.entityStateFactory.id, name: name, version: 1 };

            await lastValueFrom(indexDBService.update<IEntity>('entities', entityLoadedPayload));

            await EntityLoadFromServerSucceeded.set(this.entityStateFactory, entityLoadedPayload);

        } catch (error) {
            await EntityLoadFromServerFailed.set(this.entityStateFactory);
        }
    }
}
