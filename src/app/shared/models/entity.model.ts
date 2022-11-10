import { NgxIndexedDBService, ObjectStoreSchema } from "ngx-indexed-db";
import { lastValueFrom, BehaviorSubject, catchError, EMPTY, timer, take, filter, map } from "rxjs";
import { defaultError } from "../helpers/entity.helper";

export class Entity {
    state$ = new BehaviorSubject<IEntityState>(new EntityLoading(this));

    constructor(public id: string) {
        this.state$.pipe(
            catchError(x => {
                console.error(x);
                return EMPTY;
            })
        ).subscribe(console.log);
    }

    async init(indexDBService: NgxIndexedDBService) {
        const entityLoading = await lastValueFrom(this.state$.pipe(
            filter(state => state instanceof EntityLoading),
            take(1),
            map(state => state.entityRef.state$.value as EntityLoading)
        ));

        entityLoading.onLoadFromDB(`https://jsonplaceholder.typicode.com/todos/1${this.id}`, indexDBService);

        const entityLoadedFromDB = await lastValueFrom(this.state$.pipe(
            filter(state => state instanceof EntityLoadedFromDB || state instanceof EntityNotLoadedFromDB),
            take(1),
            map(state => state.entityRef.state$.value as EntityLoadedFromDB | EntityNotLoadedFromDB)
        ));

        entityLoadedFromDB.onLoadFromServer(`https://jsonplaceholder.typicode.com/todos/1${this.id}`, indexDBService);

        this.state$.pipe(
            filter(state => state.entityRef.state$.value instanceof EntityLoadedFromServerError),
            map(state => state as EntityLoadedFromServerError)
        ).subscribe(state => timer(5000).subscribe(() => state.onLoadFromServer(`https://jsonplaceholder.typicode.com/todos/1${this.id}`, indexDBService)));
    }
}

export interface IEntityState {
    entityRef: Entity;
    onLoadFromDB: (name: string, indexBDService: NgxIndexedDBService) => Promise<void>;
    onLoadFromServer: (name: string, indexBDService: NgxIndexedDBService) => Promise<void>;
    match: (matcher: IEntityResult) => Promise<void>;
}

export interface IAbstractEntityState {
    match(matcher: IEntityResult): Promise<void>;
    onLoadFromDB(_name: string, _indexDBService: NgxIndexedDBService): Promise<void>;
    onLoadFromServer(_name: string, _indexDBService: NgxIndexedDBService): Promise<void>;
    saveToDataBase(_: NgxIndexedDBService): Promise<void>;
}

export abstract class AbstractEntityState implements IAbstractEntityState {
    protected constructor(public entityRef: Entity) { }

    async match(matcher: IEntityResult): Promise<void> {
        if ((this.entityRef.state$.value instanceof EntityLoadedFromDB || this.entityRef.state$.value instanceof EntityLoadedFromServer) && matcher.ok)
            matcher.ok(this.entityRef.state$.value);
        else if (this.entityRef.state$.value instanceof EntityLoading && matcher.loading)
            matcher.loading(this.entityRef.state$.value);
        else if (matcher.undefined)
            matcher.undefined();
    }

    async onLoadFromServer(_name: string, _indexDBService: NgxIndexedDBService): Promise<void> {
        throw defaultError(this.entityRef, this.onLoadFromServer);
    };

    async onLoadFromDB(_name: string, _indexDBService: NgxIndexedDBService): Promise<void> {
        throw defaultError(this.entityRef, this.onLoadFromDB);
    };

    async saveToDataBase(_: NgxIndexedDBService): Promise<void> {
        throw defaultError(this.entityRef, this.saveToDataBase);
    }
}

export class EntityLoading extends AbstractEntityState {
    constructor(entityRef: Entity) {
        super(entityRef);
    }

    override async onLoadFromDB(url: string, indexBDService: NgxIndexedDBService): Promise<void> {
        
        let entityProps: EntityLoadedPayload | undefined = undefined;
        try {
            entityProps = await lastValueFrom(indexBDService.getByKey('entities2', '1'));
        } catch (error: any) {
            const isNotFound = error.code === 8;

            if (isNotFound) {
                indexBDService.createObjectStore({
                    store: 'entities2',
                    storeConfig: { keyPath: 'id', autoIncrement: false },
                    storeSchema: [
                        { name: 'name', keypath: 'name', options: { unique: false } },
                    ] as ObjectStoreSchema[]
                });

                entityProps = await lastValueFrom(indexBDService.getByKey('entities2', '1'));
            }
        }

        if (entityProps)
            this.entityRef.state$.next(new EntityLoadedFromDB(this.entityRef, entityProps));
        else
            this.entityRef.state$.next(new EntityNotLoadedFromDB(this.entityRef));
    };
}


export interface EntityLoadedPayload {
    id: string;
    name: string;
}

export class EntityLoadedFromDB extends AbstractEntityState {
    constructor(entityRef: Entity, public props: EntityLoadedPayload) {
        super(entityRef);
    }

    override async onLoadFromServer(url: string, indexDBService: NgxIndexedDBService): Promise<void> {
        try {
            const name: string = await fetch(url)
                .then(response => response.json())
                .then(json => json.title);

            const entityLoadedPayload: EntityLoadedPayload = { id: '1', name: name };

            await lastValueFrom(indexDBService.update<EntityLoadedPayload>('entities2', entityLoadedPayload));
            this.entityRef.state$.next(new EntityLoadedFromServer(this.entityRef, entityLoadedPayload));
        } catch (error) {
            this.entityRef.state$.next(new EntityLoadedFromServerError(this.entityRef));
        }
    }
}

export class EntityNotLoadedFromDB extends AbstractEntityState {
    constructor(entityRef: Entity) {
        super(entityRef);
    }

    override async onLoadFromServer(url: string, indexDBService: NgxIndexedDBService): Promise<void> {
        const name: string = await fetch(url)
            .then(response => response.json())
            .then(json => json.title);

        const entityLoadedPayload: EntityLoadedPayload = { id: '1', name: name };

        await lastValueFrom(indexDBService.update<EntityLoadedPayload>('entities2', entityLoadedPayload));
        this.entityRef.state$.next(new EntityLoadedFromServer(this.entityRef, entityLoadedPayload));
    }
}

export class EntityLoadedFromServer extends AbstractEntityState {
    constructor(entityRef: Entity, public props: EntityLoadedPayload) {
        super(entityRef);
    }
}

export class EntityLoadedFromServerError extends AbstractEntityState {
    constructor(entityRef: Entity) {
        super(entityRef);
    }

    override async onLoadFromServer(url: string, indexDBService: NgxIndexedDBService): Promise<void> {
        const name: string = await fetch(url)
            .then(response => response.json())
            .then(json => json.title);

        const entityLoadedPayload: EntityLoadedPayload = { id: this.entityRef.id, name: name };

        await lastValueFrom(indexDBService.update<EntityLoadedPayload>('entities2', entityLoadedPayload));
        this.entityRef.state$.next(new EntityLoadedFromDB(this.entityRef, entityLoadedPayload));
    }
}

export interface IEntityResult {
    loading?: (entity: EntityLoading) => void,
    ok?: (entity: EntityLoadedFromDB | EntityLoadedFromServer) => void,
    undefined?: () => void
}

export async function entityCodeExample(indexDBService: NgxIndexedDBService) {
    const entity = new Entity('1');
    await entity.init(indexDBService);
}
