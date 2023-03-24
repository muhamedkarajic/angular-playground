import { NgxIndexedDBService } from "ngx-indexed-db";
import { BehaviorSubject, catchError, EMPTY, lastValueFrom, Observable, take } from "rxjs";
import { IsLoading } from "../../types/loading.type";
import { EntityClient } from "./entity-client";
import { IEntityState } from "./i-entity-state";
import { EntityLoadFromServerSucceeded } from "./states/entity-load-from-server-succeeded";
import { EntityLoadedFromServerLockRequested } from "./states/entity-loaded-from-server-lock-requested";
import { EntityLoadedFromServerLocked } from "./states/entity-loaded-from-server-locked";
import { EntityUndefined } from "./states/entity-undefined";

export class EntityStateFactory {
    readonly state$ = new BehaviorSubject<IEntityState>(new EntityUndefined(this));

    private constructor(public readonly id: string, public readonly entityApiHub: EntityClient, public readonly indexDBService: NgxIndexedDBService) {
        this.state$.pipe(
            catchError(x => {
                console.error('Unexpected error', x);
                return EMPTY;
            })
        ).subscribe(console.log);

        entityApiHub.entityReturned$.subscribe((entity) => {
            EntityLoadFromServerSucceeded.set(this, entity);
        });

        entityApiHub.entityLocked$.subscribe(async () => {
            const entityState = await lastValueFrom(this.state$.pipe(take(1)))

            if (entityState instanceof EntityLoadedFromServerLockRequested) {
                EntityLoadedFromServerLocked.set(this, entityState.props);
                return;
            }

            console.error('Unexpected error. Entity tried to get locked on state: ', entityState.constructor.name);
        });
    }

    static create(id: string, entityApiHub: EntityClient, indexDBService: NgxIndexedDBService): Observable<IEntityState | IsLoading> {
        const entityStateFactory = new EntityStateFactory(id, entityApiHub, indexDBService);
        return entityStateFactory.state$.asObservable();
    }
}
