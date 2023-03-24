import { NgxIndexedDBService } from "ngx-indexed-db";
import { lastValueFrom, timer } from "rxjs";
import { EntityStateFactory } from "../entity-state-factory";
import { IEntity } from "../i-entity";
import { IEntityResult } from "../i-entity-result";
import { IEntityState } from "../i-entity-state";
import { EntityLoadFromServerSucceeded } from "./entity-load-from-server-succeeded";

export class EntityLoadedFromServerLocked implements IEntityState {
    static MAX_NUMBER_OF_RETRIES = 3;

    retryNumber = 0

    private constructor(public entityStateFactory: EntityStateFactory, public props: IEntity) { }

    static async set(entityFactory: EntityStateFactory, entityPayload: IEntity): Promise<void> {
        const entityLoadedFromDB = new EntityLoadedFromServerLocked(entityFactory, entityPayload);
        entityFactory.state$.next(entityLoadedFromDB);
    }

    match(matcher: IEntityResult): void {
        matcher.ok?.(this);
    }

    async requestUnlockFromServer(url: string, indexDBService: NgxIndexedDBService): Promise<void> {
        while (this.retryNumber < EntityLoadedFromServerLocked.MAX_NUMBER_OF_RETRIES) {
            await lastValueFrom(timer(5000));

            try {
                const name: string = await fetch(url)
                    .then(response => response.json())
                    .then(json => json.title);

                const entityLoadedPayload: IEntity = { id: this.entityStateFactory.id, name: name, version: 1 };

                await lastValueFrom(indexDBService.update<IEntity>('entities', entityLoadedPayload));
                await EntityLoadFromServerSucceeded.set(this.entityStateFactory, entityLoadedPayload);
            } catch (error) { }
        }
    }

    async commitChangesToServer(url: string, indexDBService: NgxIndexedDBService): Promise<void> {
        while (this.retryNumber < EntityLoadedFromServerLocked.MAX_NUMBER_OF_RETRIES) {
            await lastValueFrom(timer(5000));

            try {
                const name: string = await fetch(url)
                    .then(response => response.json())
                    .then(json => json.title);

                const entityLoadedPayload: IEntity = { id: this.entityStateFactory.id, name: name, version: 1 };

                await lastValueFrom(indexDBService.update<IEntity>('entities', entityLoadedPayload));
                await EntityLoadFromServerSucceeded.set(this.entityStateFactory, entityLoadedPayload);
            } catch (error) { }
        }
    }
}
