import { lastValueFrom, timer, take, BehaviorSubject, catchError, EMPTY } from "rxjs";

export interface IEntityState {
    state: Entity;
    onLoad: (name: string) => Promise<void>;
}

export class EntityState implements IEntityState {
    state: Entity;

    constructor(state: Entity) {
        this.state = state;
    }

    async onLoad(_: string): Promise<void> {
        throw new Error('Invalid Operation: Cannot perform task in current state.');
    }
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
    state: Entity;

    constructor(state: Entity) {
        this.state = state;
    }

    async onLoad(_: string): Promise<void> {
        throw Error(`${this.state.state.value.constructor.name} state isn't supporting '${this.onLoad.name}' function.`);
    };
}

export class EntityLoading extends AbstractEntityState {
    constructor(state: Entity) {
        super(state);
    }

    override async onLoad(name: string): Promise<void> {
        await lastValueFrom(timer(1000));

        this.state.state.next(new EntityLoaded(this.state, name));
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
    entity.state.subscribe(x => {
        if (x instanceof EntityLoaded) {
            console.log('loaded', x);
        }
        else if (x instanceof EntityLoading) {
            console.log('loading', x);
        }
    });

    const lastEntityState = await lastValueFrom(entity.state.pipe(take(1)));

    await lastEntityState.onLoad('test');

    const lastEntityState_test = await lastValueFrom(entity.state.pipe(take(1)));

    await lastEntityState_test.onLoad('Should not work.');
}
