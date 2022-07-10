import { Pipe, PipeTransform } from '@angular/core';
import { combineLatest, filter, map, Observable, of } from 'rxjs';

type ObservableProps<T> = {
  [P in keyof T]: Observable<T[P]>;
};

type ObjProps<T> = {
  [P in keyof T]: {
    value: T[P]
  }
};

type MyType<T> = {
  key: keyof T;
  value: any;
}

@Pipe({
  name: 'myCombineLatest'
})
export class MyCombineLatestPipe implements PipeTransform {
  transform<T>(itemsRecord$: ObservableProps<T>, ignoreUndefined = false): Observable<ObjProps<T>> {

    const myArray: Observable<MyType<T>>[] = [];
    for (const [key, value] of Object.entries(itemsRecord$)) {
      const val = value as Observable<any>;
      let obs = val.pipe(map(x => ({ key: key, value: x } as MyType<T>)));
      myArray.push(obs);
    }

    const obs$ = myArray.length == 0 ? of([]) : combineLatest(myArray);

    const obj$ = obs$.pipe(map(x => {
      let y: ObjProps<T> = {} as ObjProps<T>;
      for (const item of x) {
        y[item.key] = { value: item.value };
      }
      return y;
    }));
    if (ignoreUndefined)
      return obj$.pipe(filter(obj => {
        const values = Object.values(obj) as ObjProps<T[]>;
        let x = values.some(v => v.value === undefined || v.value === null);
        if (x)
          return !x;
        return true;
      }));
    return obj$;
  }
}
