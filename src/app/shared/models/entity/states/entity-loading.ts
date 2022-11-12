import { NgxIndexedDBService } from "ngx-indexed-db";
import { lastValueFrom } from "rxjs";
import { EntityStateFactory } from "../entity-state-factory";
import { IEntity } from "../i-entity";
import { IEntityResult } from "../i-entity-result";
import { IEntityState } from "../i-entity-state";
import { EntityLoadFromStorageFailed } from "./entity-load-from-storage-failed";
import { EntityLoadFromStorageSucceeded } from "./entity-load-from-storage-succeeded";

export class EntityLoading implements IEntityState {

    private constructor(public entityStateFactory: EntityStateFactory) { }

    static async set(entityStateFactory: EntityStateFactory): Promise<void> {
        const entityLoading = new EntityLoading(entityStateFactory);
        entityStateFactory.state$.next(entityLoading);
        void entityLoading.loadFromStorage(entityStateFactory.indexDBService)
    }

    async match(matcher: IEntityResult): Promise<void> {
        matcher.loading?.(this);
    }

    async loadFromStorage(indexBDService: NgxIndexedDBService): Promise<void> {
        let entityProps: IEntity | undefined = undefined;
        try {
            entityProps = await lastValueFrom(indexBDService.getByKey('entities', '1'));
        } catch (error: unknown) { }

        if (entityProps)
            await EntityLoadFromStorageSucceeded.set(this.entityStateFactory, entityProps);
        else
            await EntityLoadFromStorageFailed.set(this.entityStateFactory);
    };
}
