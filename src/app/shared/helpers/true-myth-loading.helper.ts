import { Result } from 'true-myth';
import { Err } from 'true-myth/src/public/result';
import {
    of,
    OperatorFunction,
    pipe,
} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AsyncSwitchTransform, SwitchTransform } from './true-myth.helper';
import { loading } from './user.helper';

/**
 * Handles chaining async function calls that transform from one type to another
 * @param mapFunc
 */
 export function mapLoading$<I extends loading | unknown, O extends loading | unknown, E, F>(
  mapFunc: SwitchTransform<I, O, E>
): OperatorFunction<Result<I, F>, Result<O, E | F>> {

  console.log(mapFunc.constructor.name);

  return pipe(
    map(x => {
      if(x.isOk && x.value === 'LOADING')
      {
        return x as unknown as Result<O, E | F>;
      }
      return x.isOk ? mapFunc(x.value) : x as Err<any, E | F>; // tslint:disable-line
    })
  );
}

/**
 * Handles chaining async function calls that transform from one type to another
 * @param mapFunc
 */
 export function switchMapLoading$<I extends loading | unknown, O extends loading | unknown, E, F>(
  mapFunc: AsyncSwitchTransform<I, O, E>
): OperatorFunction<Result<I, F>, Result<O, E | F>> {  
  console.log(mapFunc.constructor.name);

  return pipe(
    switchMap(x => {
      if(x.isOk && x.value === 'LOADING')
      {
        return of(x as unknown as Result<O, E | F>);
      }
      return x.isOk ? mapFunc(x.value) : of(x as Err<any, E | F>);
    })
  );
}
