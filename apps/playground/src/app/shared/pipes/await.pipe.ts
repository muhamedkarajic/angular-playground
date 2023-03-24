import { ChangeDetectorRef, EventEmitter, inject, OnDestroy, Pipe, PipeTransform, ɵisPromise } from '@angular/core';
import { combineLatest, from, isObservable, map, Observable, of, Subscribable, Unsubscribable } from 'rxjs';

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
    private ref: ChangeDetectorRef | null = inject(ChangeDetectorRef);
    private observable: Observable<ObjectProps<any>> | null = null;
    private subscription: Unsubscribable | Promise<ObjectProps<any>> | null = null;
    private strategy: SubscriptionStrategy<any> | null = null;
    private latestValue: ObjectProps<any> | null = null;
    private observables: (Subscribable<any> | Promise<any> | EventEmitter<any>)[] | null = null;
    private cache = new Cache<any>();

    transform<T>(objWithObservableProps: ObservableProps<T>): ObjectProps<T> | null {
        if (this.cache.objWithObservableProps != objWithObservableProps) {
            this.cache.objWithObservableProps = objWithObservableProps;

            const observables: (Subscribable<any> | Promise<any> | EventEmitter<any>)[] = [];

            const observableTasks: Observable<MyObject<any>>[] = [];

            for (const [_key, _value] of Object.entries(objWithObservableProps)) {
                const key = _key as keyof T;
                let value = _value as Observable<T[keyof T]> | Promise<T[keyof T]>;


                observables.push(value);

                if (value instanceof Promise) {
                    value = from(value);
                }

                if (!isObservable(_value))
                    throw Error(`Provided object ${String(key)} is not an observable.`);

                const object$: Observable<MyObject<any>> = value.pipe(map(x => ({ key: key, value: x })));


                observableTasks.push(object$);
            }

            this.cache.observableTasks = observableTasks;
            this.cache.observables = observables;

            if (this.observables) {
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
        const objects$ = observables$.length == 0 ? of([]) : combineLatest(observables$);

        let obj$ = objects$.pipe(map(objects => {
            let objectProps: ObjectProps<T> = {} as ObjectProps<T>;
            objects.forEach(object => objectProps[object.key] = { value: object.value })
            return objectProps;
        }));

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
    }

    private _dispose(): void {
        this.latestValue = null;

        this.strategy!.dispose(this.subscription!);
        this.observable = null;
    }

    private _updateLatestValue_<T>(async: Observable<ObjectProps<T>>, value: ObjectProps<T>): void {
        if (this.observable == async) {
            this.latestValue = value;
            this.ref!.markForCheck();
        }
    }

    ngOnDestroy(): void {
        if (this.subscription)
            this._dispose();
        this.ref = null;
    }
}