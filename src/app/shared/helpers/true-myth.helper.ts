import { Result } from 'true-myth';
import { Err } from 'true-myth/src/public/result';

import {
    of,
    OperatorFunction,
    pipe,
} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Let's create a type alias for a Promise of a Result just to save us some typing
export type AsyncResult<S, E> = Promise<Result<S, E>>;
// ...alias type for our async switch functions
export type AsyncSwitch<S, E> = (input: S) => AsyncResult<S, E>;
// ...and finally an alias for our synchronous switch functions
export type Switch<S, E> = (input: S) => Result<S, E>;

/**
 * Converts synchronous switch functions to async so they can be used in our
 * async function pipeline
 *
 * @param syncSwitch
 */
export function convertToAsync<S, E>(
  syncSwitch: Switch<S, E>
): AsyncSwitch<S, E> {
  return async (input: S) => {
    return Promise.resolve(syncSwitch(input));
  };
}

export class AsyncRailway<S, E> {
  private switches: Array<AsyncSwitch<S, E>> = [];
  constructor(private readonly input: Result<S, E>) {}

  static leaveTrainStation<S, E>(input: Result<S, E>) {
    return new AsyncRailway(input);
  }

  andThen(switchFunction: AsyncSwitch<S, E>) {
    this.switches.push(switchFunction);
    return this;
  }

  async arriveAtDestination(): AsyncResult<S, E> {
    return this.switches.reduce(async (previousPromise, nextSwitch) => {
      const previousResult = await previousPromise;
      return previousResult.isOk
        ? nextSwitch(previousResult.value)
        : previousResult;
    }, Promise.resolve(this.input));
  }
}

export type AsyncSwitchTransform<I, O, E> = (input: I) => AsyncResult<O, E>;
export type SwitchTransform<I, O, E> = (input: I) => Result<O, E>;

/**
 * Handles chaining async function calls that transform from one type to another
 * @param mapFunc
 */
export function map$<I, O, E, F>(
  mapFunc: SwitchTransform<I, O, E>
): OperatorFunction<Result<I, F>, Result<O, E | F>> {

  console.log(mapFunc.constructor.name);

  return pipe(
    map(x => {
      return x.isOk ? mapFunc(x.value) : x as Err<any, E | F>; // tslint:disable-line
    })
  );
}

/**
 * Handles chaining async function calls that transform from one type to another
 * @param mapFunc
 */
 export function switchMap$<I, O, E, F>(
  mapFunc: AsyncSwitchTransform<I, O, E>
): OperatorFunction<Result<I, F>, Result<O, E | F>> {  
  console.log(mapFunc.constructor.name);

  return pipe(
    switchMap(x => {
      return x.isOk ? mapFunc(x.value) : of(x as Err<any, E | F>);
    })
  );
}
