import { lastValueFrom, ReplaySubject, timer } from "rxjs";
import { IEntity } from "./i-entity";

export class EntityClient {
    entityReturned$ = new ReplaySubject<IEntity>(1);
    entityLocked$ = new ReplaySubject<void>(1);

    async requestEntityById(id: string): Promise<void> {
        await lastValueFrom(timer(1000));
        this.entityReturned$.next({
            id: id,
            name: 'EntityName',
            version: 1
        })
    }

    async lockEntityById(id: string): Promise<void> {
        await lastValueFrom(timer(1000));
        this.entityLocked$.next();
    }
}
