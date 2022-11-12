import { NgxIndexedDBService } from "ngx-indexed-db";
import { lastValueFrom, timer } from "rxjs";
import { EntityStateFactory } from "../entity-state-factory";
import { IEntity } from "../i-entity";
import { IEntityResult } from "../i-entity-result";
import { IEntityState } from "../i-entity-state";
import { EntityLoadFromStorageFailed } from "./entity-load-from-storage-failed";
import { EntityLoadFromStorageSucceeded } from "./entity-load-from-storage-succeeded";

export class EntityLoading implements IEntityState {
    private constructor(public entityFactory: EntityStateFactory) { }

    static async set(entityFactory: EntityStateFactory): Promise<void> {
        const entityLoading = new EntityLoading(entityFactory);
        entityFactory.state$.next(entityLoading);
        void entityLoading.loadFromStorage(entityFactory.indexDBService)
    }

    async match(matcher: IEntityResult): Promise<void> {
        matcher.loading?.(this);
    }

    async loadFromStorage(indexBDService: NgxIndexedDBService): Promise<void> {
        await lastValueFrom(timer(5000));

        let entityProps: IEntity | undefined = undefined;
        try {
            entityProps = await lastValueFrom(indexBDService.getByKey('entities', '1'));
        } catch (error: any) { }

        if (entityProps)
            await EntityLoadFromStorageSucceeded.set(this.entityFactory, entityProps);
        else
            await EntityLoadFromStorageFailed.set(this.entityFactory);
    };
}
