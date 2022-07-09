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
  transform<T>(itemsRecord$: ObservableProps<T>): Observable<ObjProps<T>> {
    
    const myArray: Observable<MyType<T>>[] = [];
    for (const [key, value] of Object.entries(itemsRecord$)) {
      const val = value as Observable<any>;
      let obs = val.pipe(map(x => ({key: key, value: x } as MyType<T>))); 
      myArray.push(obs);
    }
    
    const obs$ = myArray.length == 0 ? of([]) : combineLatest(myArray);

    const obj$ =  obs$.pipe(map(x => {
      let y: ObjProps<T> = {} as ObjProps<T>;
      for (const item of x) {
        y[item.key] = {value: item.value};
      }
      return y;
    }));

    return obj$.pipe(filter(obj => {
      const values = Object.values(obj) as ObjProps<T[]>;
      let x = values.some(v => v.value === undefined || v.value === null);
      if(x)
        return !x;
      return true;
    }));
  }
}



// import { Pipe, PipeTransform } from '@angular/core';
// import { combineLatest, map, Observable, of } from 'rxjs';

// interface MyType<K, T> { key: T, value: T };
// interface MyType2<T> { value: T };


// type Obs<T> = {
//   [K in keyof T]: Observable<MyType<T, T[K]>>
// }

// type Value<T> = {
//   [K in keyof T]: T
// }

// type Foo<T> = {
//   [K in keyof T]: MyType2<T[K]>
// }

// @Pipe({
//   name: 'myCombineLatest'
// })
// export class MyCombineLatestPipe implements PipeTransform {
//   transform<T>(itemsRecord$: Observable<T>): Observable<T> {
    
//     const myArray: Observable<MyType<T, T[keyof T]>>[] = [];
//     for (const [key, value] of Object.entries(itemsRecord$)) {
//       let val = value as Observable<T>;
//       let obs = val.pipe(map(x => ({key: key, value: x } as MyType<T[keyof T], T>))); 
//       myArray.push(obs);
//     }
    
//     const obs$ = myArray.length == 0 ? of([]) : combineLatest(myArray);

//     let x =obs$.pipe(map(x => {
//       let y: Value<T> = {} as unknown as Value<T>;
//       for (const item of x) {
//         y[item.key] = {value: item.value};
//       }
//       return y;
//     }));
//     let y: Value<T> = {} as unknown as Value<T>;
//     return of(y);
//   }
// }
