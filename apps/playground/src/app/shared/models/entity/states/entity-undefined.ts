import { NgxIndexedDBService } from "ngx-indexed-db";
import { lastValueFrom } from "rxjs";
import { EntityStateFactory } from "../entity-state-factory";
import { IEntity } from "../i-entity";
import { IEntityResult } from "../i-entity-result";
import { IEntityState } from "../i-entity-state";
import { EntityLoadFromStorageFailed } from "./entity-load-from-storage-failed";
import { EntityLoadFromStorageSucceeded } from "./entity-load-from-storage-succeeded";

export class EntityUndefined implements IEntityState {

    constructor(public entityStateFactory: EntityStateFactory) {
        void this.loadFromStorage(entityStateFactory.indexDBService);
    }

    match(matcher: IEntityResult): void {
        matcher.loading?.(this);
    }

    async loadFromStorage(indexBDService: NgxIndexedDBService): Promise<void> {
        let entityProps: IEntity | undefined = undefined;
        try {
            entityProps = await lastValueFrom(indexBDService.getByKey('entities', this.entityStateFactory.id));
        } catch (error: unknown) { }

        if (entityProps)
            EntityLoadFromStorageSucceeded.set(this.entityStateFactory, entityProps);
        else
            EntityLoadFromStorageFailed.set(this.entityStateFactory);
    };
}
