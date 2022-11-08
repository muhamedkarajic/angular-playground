import { lastValueFrom, timer, ReplaySubject, take } from "rxjs";

export interface IEntityState {
    state: Entity;
    onLoad: (name: string) => Promise<void>;
}

export class EntityState implements IEntityState {
    state: Entity;

    constructor(state: Entity) {
        this.state = state;
    }

    async onLoad(name: string): Promise<void> {
        throw new Error("Invalid Operation: Cannot perform task in current state");
    }
}


abstract class AbstractEntityState implements IEntityState {
    state: Entity;

    constructor(state: Entity) {
        this.state = state;
    }

    async onLoad(name: string): Promise<void> {
        throw new Error("Invalid Operation: Cannot perform task in current state");
    }
}

export interface EntityInterface {
    load(): Promise<void>;
}

export class Entity {
    loading: EntityLoading;
    loaded: EntityLoaded;

    currentState = new ReplaySubject<IEntityState>(1);

    constructor() {
        this.loading = new EntityLoading(this);
        this.loaded = new EntityLoaded(this);

        this.setState(this.loading);
    }

    public setState(state: IEntityState) {
        this.currentState.next(state);
    }

    public getCurrentState(): ReplaySubject<IEntityState> {
        return this.currentState;
    }
}


export class EntityLoading implements EntityState {
    state: Entity;

    constructor(state: Entity) {
        this.state = state;
    }

    async onLoad(name: string): Promise<void> {
        await lastValueFrom(timer(1000));

        this.state.loaded.name = name;

        this.state.setState(this.state.loaded);
    };
}

export class EntityLoaded implements EntityState {
    name!: string;
    state: Entity;

    constructor(state: Entity) {
        this.state = state;
    }

    async onLoad(name: string): Promise<void> {
        throw Error('Already Loaded.');
    };
}


export async function entityCodeExample() {
    const entity = new Entity();
    entity.getCurrentState().subscribe(x => {
        if (x instanceof EntityLoaded) {
            console.log('loaded', x);
        }
        else if (x instanceof EntityLoading) {
            console.log('loading', x);
        }
    });

    const lastEntityState = await lastValueFrom(entity.getCurrentState().pipe(take(1)));

    await lastEntityState.onLoad('test');

    if (entity.getCurrentState() instanceof EntityLoaded)
        console.log('loaded', entity.getCurrentState())
}