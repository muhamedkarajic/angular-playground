import { lastValueFrom, take, BehaviorSubject, catchError, EMPTY } from "rxjs";

export interface IEntityState {
    entityRef: Entity;
    onLoad: (name: string) => Promise<void>;
    match: (matcher: IEntityResult) => Promise<void>;
}

export class EntityState implements IEntityState {
    constructor(public entityRef: Entity) {}

    async onLoad(_: string): Promise<void> {
        throw new Error('Invalid Operation: Cannot perform task in current state.');
    }

    async match(result: IEntityResult): Promise<void> {
        if (this.entityRef.state instanceof EntityLoaded && result.ok)
            result.ok(this.entityRef.state);
        else if (this.entityRef.state instanceof EntityLoading && result.loading)
            result.loading(this.entityRef.state);
        else if (result.undefined)
            result.undefined();
    }
}


export interface IEntityResult {
    loading?: (entity: EntityLoading) => void,
    ok?: (entity: EntityLoaded) => void,
    undefined?: () => void
}

export class Entity {
    state = new BehaviorSubject<IEntityState>(new EntityLoading(this));

    constructor() {
        this.state.pipe(
            catchError(x => {
                console.error(x);
                return EMPTY;
            })
        ).subscribe();
    }
}

export class AbstractEntityState implements EntityState {
    constructor(public entityRef: Entity) {
    }

    async match(matcher: IEntityResult): Promise<void> {
        if (this.entityRef.state.value instanceof EntityLoaded && matcher.ok)
            matcher.ok(this.entityRef.state.value);
        else if (this.entityRef.state.value instanceof EntityLoading && matcher.loading)
            matcher.loading(this.entityRef.state.value);
        else if (matcher.undefined)
            matcher.undefined();
    }

    async onLoad(_: string): Promise<void> {
        throw Error(`${this.entityRef.state.value.constructor.name} state isn't supporting '${this.onLoad.name}' function.`);
    };
}

export class EntityLoading extends AbstractEntityState {
    constructor(entityRef: Entity) {
        super(entityRef);
    }

    override async onLoad(url: string): Promise<void> {
        const name: string = await fetch(url)
            .then(response => response.json())
            .then(json => json.title);

        this.entityRef.state.next(new EntityLoaded(this.entityRef, name));
    };
}


export class EntityLoaded extends AbstractEntityState {
    name: string;

    constructor(entityRef: Entity, name: string) {
        super(entityRef);
        this.name = name;
    }
}


export async function entityCodeExample() {
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

    await lastEntityState.onLoad('https://jsonplaceholder.typicode.com/todos/1');

    const lastEntityState_test = await lastValueFrom(entity.state.pipe(take(1)));

    await lastEntityState_test.onLoad('Should not work.');
}
