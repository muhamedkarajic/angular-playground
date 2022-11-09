import { lastValueFrom, take, BehaviorSubject, catchError, EMPTY, map, OperatorFunction, pipe, of } from "rxjs";

export interface IEntityState {
    entity: Entity;
    onLoad: (name: string) => Promise<void>;
    match: (matcher: Matcher) => Promise<void>;
}

export class EntityState implements IEntityState {
    entity: Entity;

    constructor(state: Entity) {
        this.entity = state;
    }

    async onLoad(_: string): Promise<void> {
        throw new Error('Invalid Operation: Cannot perform task in current state.');
    }

    async match(matcher: Matcher): Promise<void> {
        if (this.entity.state instanceof EntityLoaded && matcher.ok)
            matcher.ok(this.entity.state);
        else if (this.entity.state instanceof EntityLoading && matcher.loading)
            matcher.loading(this.entity.state);
        else if (matcher.undefined)
            matcher.undefined();
    }
}


export interface Matcher {
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
    entity: Entity;

    constructor(state: Entity) {
        this.entity = state;
    }

    async match(matcher: Matcher): Promise<void> {
        if (this.entity.state.value instanceof EntityLoaded && matcher.ok)
            matcher.ok(this.entity.state.value);
        else if (this.entity.state.value instanceof EntityLoading && matcher.loading)
            matcher.loading(this.entity.state.value);
        else if (matcher.undefined)
            matcher.undefined();
    }

    async onLoad(_: string): Promise<void> {
        throw Error(`${this.entity.state.value.constructor.name} state isn't supporting '${this.onLoad.name}' function.`);
    };
}

export class EntityLoading extends AbstractEntityState {
    constructor(state: Entity) {
        super(state);
    }

    override async onLoad(url: string): Promise<void> {
        const name: string = await fetch(url)
            .then(response => response.json())
            .then(json => json.title);

        this.entity.state.next(new EntityLoaded(this.entity, name));
    };
}


export class EntityLoaded extends AbstractEntityState {
    name: string;

    constructor(state: Entity, name: string) {
        super(state);
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
