import {
    combineLatest,
    first,
    map,
    ObservableInputTuple,
    OperatorFunction,
    pipe,
    switchMap,
    withLatestFrom
} from 'rxjs';

/**
 * ### Description
 * Works similar to {@link withLatestFrom} with the main difference that it awaits the observables.
 * When all observables can emit at least one value, then takes the latest state of all observables and proceeds execution of the pipe.
 * Will execute this pipe only once and will only retrigger pipe execution if source observable emits a new value.
 * 
 * ### Example
 * ```ts
 * import { BehaviorSubject } from 'rxjs';
 * import { awaitLatestFrom } from '@venios/vep-advanced-entity-utils';
 * 
 * const myNumber$ = new BehaviorSubject<number>(1);
 * const myString$ = new BehaviorSubject<string>("Some text.");
 * const myBoolean$ = new BehaviorSubject<boolean>(true);
 *
 * myNumber$.pipe(
 *  awaitLatestFrom([myString$, myBoolean$])
 * ).subscribe(([myNumber, myString, myBoolean]) => {});
 * ```
 * ### Additional
 * @param observables - the observables of which the latest value will be taken when all of them have a value.
 * @returns a tuple which contains the source value as well as the values of the observables which are passed as input.
 */
export function awaitLatestFrom<T, O extends unknown[]>(
    observables: [...ObservableInputTuple<O>]
): OperatorFunction<T, [T, ...O]> {
    return pipe(
        switchMap((sourceValue) =>
            combineLatest(observables).pipe(
                first(),
                map((values) => [sourceValue, ...values] as unknown as [T, ...O])
            )
        )
    );
}
