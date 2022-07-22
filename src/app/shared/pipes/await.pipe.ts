
import { ChangeDetectorRef, EventEmitter, OnDestroy, Pipe, PipeTransform, ɵisPromise } from '@angular/core';
import { combineLatest, map, Observable, of, Subscribable, Unsubscribable, tap, from, shareReplay } from 'rxjs';

interface SubscriptionStrategy<T> {
    createSubscription(async: Subscribable<ObjectProps<T>> | Promise<ObjectProps<T>>, updateLatestValue: any): Unsubscribable
        | Promise<ObjectProps<T>>;
    dispose(subscription: Unsubscribable | Promise<ObjectProps<T>>): void;
}

type ObservableProps<T> = {
    [K in keyof T]: Subscribable<T[K]> | Promise<T[K]> | EventEmitter<T[K]> | Observable<T[K]>;
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

class SubscribableStrategy<T> implements SubscriptionStrategy<T> {
    createSubscription(async: Subscribable<ObjectProps<T>>, updateLatestValue: any): Unsubscribable {
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

class PromiseStrategy<T> implements SubscriptionStrategy<T> {
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
export class AwaitPipe implements OnDestroy, PipeTransform {
    private _ref: ChangeDetectorRef | null;

    private observable: Observable<ObjectProps<any>> | null = null;
    private subscription: Unsubscribable | Promise<ObjectProps<any>> | null = null;
    private strategy: SubscriptionStrategy<any> | null = null;
    private latestValue: ObjectProps<any> | null = null;
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

    cache = new Cache<any>();

    transform<T>(objWithObservableProps: ObservableProps<T>): ObjectProps<T> | null {
        if (this.cache.objWithObservableProps != objWithObservableProps) {
            this.cache.objWithObservableProps = objWithObservableProps;

            const observables: (Subscribable<any> | Promise<any> | EventEmitter<any>)[] = [];

            const observableTasks: Observable<MyObject<any>>[] = [];

            for (const [_key, _value] of Object.entries(objWithObservableProps)) {
                const key = _key as keyof T;
                let value = _value as Observable<T[keyof T]> | Promise<T[keyof T]>;

                // if (!isObservable(_value))
                //     throw Error(`Provided object ${String(key)} is not an observable.`);

                observables.push(value);

                if (value instanceof Promise) {
                    value = from(value);
                }

                const object$: Observable<MyObject<any>> = value.pipe(map(x => ({ key: key, value: x })));


                observableTasks.push(object$);
            }

            // if (observableTasks.length == 0) {
            //     throw Error(`Provided object dosen't contain any props. Object ${objWithObservableProps}`);
            // }

            this.cache.observableTasks = observableTasks;
            this.cache.observables = observables;

            if (this.observables) {
                // if (this.cache.observables!.length !== this.observables.length) {
                //     throw Error(`Previous number of keys of don't match with current.`)
                // }

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

    combineObservables<T>(observables$: Observable<MyObject<T>>[]): Observable<ObjectProps<T>> {
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

    private _subscribe<T>(objs: (Subscribable<T> | Promise<T> | EventEmitter<T>)[], observables$: Observable<MyObject<T>>[]): void {
        const obs$ = this.combineObservables(observables$);
        this.observable = obs$;
        this.strategy = this._selectStrategy(obs$)
        this.subscription = this.strategy.createSubscription(
            obs$, (value: ObjectProps<T>) => this._updateLatestValue_(obs$, value)
        );


        this.observables = objs;

    }

    private _selectStrategy<T>(obj: Subscribable<T> | Promise<T> |
        EventEmitter<T>): SubscriptionStrategy<T> {
        if (ɵisPromise(obj)) {
            return _promiseStrategy;
        }

        return _subscribableStrategy;

        // throw Error(`${AwaitPipe} throwed an error, strategy could not be selected. Object: ${obj}`);
    }

    private _dispose(): void {
        this.subscriptionsCount--;
        console.log(this.subscriptionsCount);
        this.latestValue = null;

        this.strategy!.dispose(this.subscription!);
        this.observable = null;
    }

    private _updateLatestValue_<T>(async: Observable<ObjectProps<T>>, value: ObjectProps<T>): void {
        if (this.observable == async) {
            this.latestValue = value;
            this._ref!.markForCheck();
        }
    }
}