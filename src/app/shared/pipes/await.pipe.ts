import { AsyncPipe } from '@angular/common';
import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { combineLatest, filter, isObservable, map, Observable, of, Subject, takeUntil, tap } from 'rxjs';

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

@Pipe({
  name: 'await'
})
export class MyCombineLatestPipe implements PipeTransform, OnDestroy {

  constructor(private asyncPipe: AsyncPipe) {}

  onDestory$ = new Subject<void>();

  ngOnDestroy(): void {
    this.onDestory$.next();
    this.onDestory$.complete();
  }

  transform<T>(itemsRecord$: ObservableProps<T>, ignoreUndefined = false): ObjectProps<T> {
    const observables$: Observable<MyObject<T>>[] = [];

    for (const [_key, _value] of Object.entries(itemsRecord$)) {
      const key = _key as keyof T;
      const value = _value as Observable<T[keyof T]>;

      if (!isObservable(_value))
        throw Error(`Provided object ${String(key)} is not an observable.`);

      const object$: Observable<MyObject<T>> = value.pipe(map(x => ({ key: key, value: x })));

      observables$.push(object$);
    }

    const objects$ = observables$.length == 0 ? of([]) : combineLatest(observables$);

    let obj$ = objects$.pipe(map(objects => {
      let objectProps: ObjectProps<T> = {} as ObjectProps<T>;
      objects.forEach(object => objectProps[object.key] = { value: object.value })
      return objectProps;
    }));

    if (ignoreUndefined)
      obj$ = obj$.pipe(filter(objects => {
        const values = Object.values(objects) as ObjectProps<T[]>;
        let x = values.some(v => v.value === undefined || v.value === null || (typeof v.value === 'number' && isNaN(v.value)));
        return !x;
      }));

    obj$ = obj$.pipe(takeUntil(this.onDestory$));

    obj$.subscribe(null, null, () => console.log('Completed!'));
    
    obj$ = obj$.pipe(tap(console.log));

    return this.asyncPipe.transform(obj$)!;
  }
}
