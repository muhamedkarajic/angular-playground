import { NgxIndexedDBService } from "ngx-indexed-db";
import { lastValueFrom, take, BehaviorSubject, catchError, EMPTY } from "rxjs";

export class Entity {
    state = new BehaviorSubject<IEntityState>(EntityLoading.Instance(this));

    constructor() {
        this.state.pipe(
            catchError(x => {
                console.error(x);
                return EMPTY;
            })
        ).subscribe();
    }
}

export interface IEntityState {
    entityRef: Entity;
    onLoad: (name: string, indexBDService: NgxIndexedDBService) => Promise<void>;
    match: (matcher: IEntityResult) => Promise<void>;
}

export abstract class AbstractEntityState implements IAbstractEntityState {
    protected constructor(public entityRef: Entity) { }

    async match(matcher: IEntityResult): Promise<void> {
        if (this.entityRef.state.value instanceof EntityLoaded && matcher.ok)
            matcher.ok(this.entityRef.state.value);
        else if (this.entityRef.state.value instanceof EntityLoading && matcher.loading)
            matcher.loading(this.entityRef.state.value);
        else if (matcher.undefined)
            matcher.undefined();
    }

    async onLoad(_name: string, _indexDBService: NgxIndexedDBService): Promise<void> {
        throw Error(`${this.entityRef.state.value.constructor.name} state isn't supporting '${this.onLoad.name}' function.`);
    };

    async saveToDataBase(_: NgxIndexedDBService): Promise<void> {
        throw Error(`${this.entityRef.state.value.constructor.name} state isn't supporting '${this.saveToDataBase.name}' function.`);
    }
}
export interface IAbstractEntityState {

    match(matcher: IEntityResult): Promise<void>;

    onLoad(_name: string, _indexDBService: NgxIndexedDBService): Promise<void>;

    saveToDataBase(_: NgxIndexedDBService): Promise<void>;
}



export class EntityLoading extends AbstractEntityState {
    private constructor(entityRef: Entity) {
        super(entityRef);
    }

    static Instance(entityRef: Entity): EntityLoading {
        return new EntityLoading(entityRef);
    }

    override async onLoad(url: string, indexBDService: NgxIndexedDBService): Promise<void> {
        const name: string = await fetch(url)
            .then(response => response.json())
            .then(json => json.title);

        const entityProps: EntityLoaded['props'] | undefined = await lastValueFrom(indexBDService.getByKey('entities', '1'));

        if (entityProps)
            this.entityRef.state.next(EntityLoaded.Instance(this.entityRef, entityProps));
        else
            await lastValueFrom(indexBDService.update('entities', { id: '1', name: name }).pipe(catchError(err => {
                console.log(err);
                return EMPTY
            })))
    };
}

export class EntityLoaded extends AbstractEntityState {
    props!: Record<string, unknown> & {
        id: string;
        name: string;
    };

    private constructor(
        entityRef: Entity
    ) {
        super(entityRef);
    }

    static Instance(entityRef: Entity, props: Record<string, unknown> & {
        id: string;
        name: string;
    }): EntityLoaded {
        const entityLoaded = new EntityLoaded(entityRef);
        entityLoaded.props = props;
        return entityLoaded;
    }
}

export interface IEntityResult {
    loading?: (entity: EntityLoading) => void,
    ok?: (entity: EntityLoaded) => void,
    undefined?: () => void
}


export async function entityCodeExample(indexBDService: NgxIndexedDBService) {
    const entity = new Entity();
    entity.state.subscribe(result => {
        result.match({
            loading(entity: EntityLoading) {
                console.log('loading', entity);
            },
            ok(entity: EntityLoaded) {
                console.log('ok', entity);
            },
            undefined() {
                console.log('undefined');
            }
        })
    });

    const lastEntityState = await lastValueFrom(entity.state.pipe(take(1)));

    await lastEntityState.onLoad('https://jsonplaceholder.typicode.com/todos/1', indexBDService);

    const lastEntityState_test = await lastValueFrom(entity.state.pipe(take(1)));

    await lastEntityState_test.onLoad('Should not work.', indexBDService);
}
