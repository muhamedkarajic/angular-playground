import {
  of,
  OperatorFunction,
  pipe
} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Result } from 'true-myth';
import { Err } from 'true-myth/src/public/result';
import { IsLoading } from '../../types/loading.type';
import { AsyncSwitchTransform, SwitchTransform } from './true-myth.helper';

/**
 * Handles chaining async function calls that transform from one type to another
 * @param mapFunc
 */
export function mapLoadingObs$<I extends IsLoading | unknown, O extends IsLoading | unknown, E, F>(
  mapFunc: SwitchTransform<I, O, E>
): OperatorFunction<Result<I, F>, Result<O, E | F>> {

  return pipe(
    map(x => {
      if (x.isOk && x.value instanceof IsLoading) {
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
export function switchMapLoadingObs$<I extends IsLoading | unknown, O extends IsLoading | unknown, E, F>(
  mapFunc: AsyncSwitchTransform<I, O, E>
): OperatorFunction<Result<I, F>, Result<O, E | F>> {
  return pipe(
    switchMap(x => {
      if (x.isOk && x.value instanceof IsLoading) {
        return of(x as unknown as Result<O, E | F>);
      }
      return x.isOk ? mapFunc(x.value) : of(x as Err<any, E | F>);
    })
  );
}
