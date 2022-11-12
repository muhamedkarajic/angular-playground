import { NgxIndexedDBService } from "ngx-indexed-db";
import { lastValueFrom, timer } from "rxjs";
import { EntityStateFactory } from "../entity-state-factory";
import { IEntity } from "../i-entity";
import { IEntityState } from "../i-entity-state";
import { IEntityResult } from "../i-entity-result";
import { EntityLoadFromServerFailed } from "./entity-load-from-server-failed";
import { EntityLoadFromServerSucceeded } from "./entity-load-from-server-succeeded";

export class EntityLoadFromStorageSucceeded implements IEntityState {
    private constructor(public entityFactory: EntityStateFactory, public props: IEntity) { }

    static async set(entityFactory: EntityStateFactory, entityPayload: IEntity): Promise<void> {
        const entityLoadedFromDB = new EntityLoadFromStorageSucceeded(entityFactory, entityPayload);
        entityFactory.state$.next(entityLoadedFromDB);
        void entityLoadedFromDB.requestFromServer(`${entityFactory.entityApiHub}/${entityFactory.id}`, entityFactory.indexDBService);
    }

    async match(matcher: IEntityResult): Promise<void> {
        matcher.ok?.(this);
    }

    async requestFromServer(url: string, indexDBService: NgxIndexedDBService): Promise<void> {
        await lastValueFrom(timer(5000));

        try {
            const name: string = await fetch(url)
                .then(response => response.json())
                .then(json => json.title);

            const entityLoadedPayload: IEntity = { id: this.props.id, name: name, version: 1 };

            await lastValueFrom(indexDBService.update<IEntity>('entities', entityLoadedPayload));
            await EntityLoadFromServerSucceeded.set(this.entityFactory, entityLoadedPayload);
        } catch (error) {
            await EntityLoadFromServerFailed.set(this.entityFactory);
        }
    }
}
