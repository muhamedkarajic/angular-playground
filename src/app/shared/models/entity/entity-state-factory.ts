import { NgxIndexedDBService } from "ngx-indexed-db";
import { catchError, EMPTY, Observable, ReplaySubject } from "rxjs";
import { IEntityState } from "./i-entity-state";
import { EntityLoading } from "./states/entity-loading";

export class EntityStateFactory {
    readonly state$ = new ReplaySubject<IEntityState>();

    private constructor(public id: string, public entityApiHub: string, public indexDBService: NgxIndexedDBService) {
        this.state$.pipe(
            catchError(x => {
                console.error(x);
                return EMPTY;
            })
        ).subscribe(console.log);
    }

    static async create(id: string, entityApiHub: string, indexDBService: NgxIndexedDBService): Promise<Observable<IEntityState>> {
        const entity = new EntityStateFactory(id, entityApiHub, indexDBService);
        EntityLoading.set(entity);
        return entity.state$.asObservable();
    }
}
