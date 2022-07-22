
import { ChangeDetectorRef, EventEmitter, OnDestroy, Pipe, PipeTransform, ɵisPromise, ɵisSubscribable } from '@angular/core';
import { combineLatest, isObservable, map, Observable, of, Subscribable, Unsubscribable, tap } from 'rxjs';

interface SubscriptionStrategy {
    createSubscription(async: Subscribable<any> | Promise<any>, updateLatestValue: any): Unsubscribable
        | Promise<any>;
    dispose(subscription: Unsubscribable | Promise<any>): void;
}

type ObservableProps<T> = {
    [K in keyof T]: Observable<T[K]>;
};

type ObjectProps<T> = {
    [K in keyof T]: {
        value: T[K]
    }
};

type MyObject<T> = {
    key: keyof T;
    value: T[keyof T];
}

class SubscribableStrategy implements SubscriptionStrategy {
    createSubscription(async: Subscribable<any>, updateLatestValue: any): Unsubscribable {
        return async.subscribe({
            next: updateLatestValue,
            error: (e: any) => {
                throw e;
            }
        });
    }

    dispose(subscription: Unsubscribable): void {
        subscription.unsubscribe();
    }
}

class PromiseStrategy implements SubscriptionStrategy {
    createSubscription(async: Promise<any>, updateLatestValue: (v: any) => any): Promise<any> {
        return async.then(updateLatestValue, e => {
            throw e;
        });
    }

    dispose(subscription: Promise<any>): void { }
}

const _promiseStrategy = new PromiseStrategy();
const _subscribableStrategy = new SubscribableStrategy();

class Cache<T> {
    objWithObservableProps: ObservableProps<T> | null = null;
    observables: (Subscribable<any> | Promise<any> | EventEmitter<any>)[] | null = null;
    observableTasks: Observable<MyObject<T>>[] | null = null;
}

@Pipe({
    name: 'await',
    pure: false
})
export class AwaitPipe<T> implements OnDestroy, PipeTransform {
    private _ref: ChangeDetectorRef | null;

    private observable: Subscribable<any> | Promise<any> | EventEmitter<any> | null = null;
    private subscription: Unsubscribable | Promise<any> | null = null;
    private strategy: SubscriptionStrategy | null = null;
    private latestValue: ObjectProps<T> | null = null;
    private observables: (Subscribable<any> | Promise<any> | EventEmitter<any>)[] | null = null;

    subscriptionsCount = 0;

    constructor(ref: ChangeDetectorRef) {
        this._ref = ref;
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this._dispose();
        }
        this._ref = null;
    }

    cache = new Cache<T>();

    transform(objWithObservableProps: ObservableProps<T>): ObjectProps<T> | null {
        if (this.cache.objWithObservableProps != objWithObservableProps) {
            this.cache.objWithObservableProps = objWithObservableProps;

            const observables: (Subscribable<any> | Promise<any> | EventEmitter<any>)[] = [];

            const observableTasks: Observable<MyObject<T>>[] = [];

            for (const [_key, _value] of Object.entries(objWithObservableProps)) {
                const key = _key as keyof T;
                const value = _value as Observable<T[keyof T]>;

                if (!isObservable(_value))
                    throw Error(`Provided object ${String(key)} is not an observable.`);

                const object$: Observable<MyObject<T>> = value.pipe(map(x => ({ key: key, value: x })));

                observables.push(value);

                observableTasks.push(object$);
            }

            if (observableTasks.length == 0) {
                throw Error(`Provided object dosen't contain any props. Object ${objWithObservableProps}`);
            }

            this.cache.observableTasks = observableTasks;
            this.cache.observables = observables;

            if (this.observables) {
                if (this.cache.observables!.length !== this.observables.length) {
                    throw Error(`Previous number of keys of don't match with current.`)
                }

                for (let i = 0; i < this.cache.observables!.length; i++) {
                    const _object$ = this.observables[i];
                    const object$ = this.cache.observables![i];

                    if (_object$ !== object$) {
                        this._dispose();
                        return this.transform(objWithObservableProps);
                    }
                }

            }
        }

        if (!this.observable) {
            if (this.cache.observableTasks!.length) {
                this._subscribe(this.cache.observables!, this.cache.observableTasks!);
            }
            return this.latestValue;
        }

        return this.latestValue;
    }

    combineObservables(observables$: Observable<MyObject<T>>[]): Observable<ObjectProps<T>> {
        this.subscriptionsCount++;
        console.log('subscriptionsCount', this.subscriptionsCount);
        const objects$ = observables$.length == 0 ? of([]) : combineLatest(observables$);

        let obj$ = objects$.pipe(map(objects => {
            let objectProps: ObjectProps<T> = {} as ObjectProps<T>;
            objects.forEach(object => objectProps[object.key] = { value: object.value })
            return objectProps;
        }));

        // if (ignoreUndefined)
        //   obj$ = obj$.pipe(filter(objects => {
        //     const values = Object.values(objects) as ObjectProps<T[]>;
        //     let x = values.some(v => v.value === undefined || v.value === null || (typeof v.value === 'number' && isNaN(v.value)));
        //     return !x;
        //   }));

        obj$ = obj$.pipe(tap(console.log));

        return obj$;
    }

    private _subscribe(objs: (Subscribable<any> | Promise<any> | EventEmitter<any>)[], observables$: Observable<MyObject<T>>[]): void {
        const obs$ = this.combineObservables(observables$);
        this.observable = obs$;
        this.strategy = this._selectStrategy(obs$)
        this.subscription = this.strategy.createSubscription(
            obs$, (value: Object) => this._updateLatestValue_(obs$, value)
        );


        this.observables = objs;

    }

    private _selectStrategy(obj: Subscribable<any> | Promise<any> |
        EventEmitter<any>): SubscriptionStrategy {
        if (ɵisPromise(obj)) {
            return _promiseStrategy;
        }

        if (ɵisSubscribable(obj)) {
            return _subscribableStrategy;
        }

        throw Error(`${AwaitPipe} throwed an error, strategy could not be selected. Object: ${obj}`);
    }

    private _dispose(): void {
        this.subscriptionsCount--;
        console.log(this.subscriptionsCount);
        this.latestValue = null;

        this.strategy!.dispose(this.subscription!);
        this.observable = null;
    }

    private _updateLatestValue_(async: any, value: any): void {
        if (this.observable === async) {
            this.latestValue = value;
            this._ref!.markForCheck();
        }
    }
}