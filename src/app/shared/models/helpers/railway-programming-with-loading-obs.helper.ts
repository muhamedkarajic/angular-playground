import { lastValueFrom, Observable, of, OperatorFunction, pipe, switchMap, timer } from "rxjs";

export type Success<T> = { tag: 'success', value: T };
export type Failure<S> = { tag: 'failure', value: S };
export type Loading = { tag: 'loading' };
export type Result<T, S> = Success<T> | Failure<S> | Loading;

export class ResultFactory {
  static create<TError>(result: Loading): Observable<Result<never, never>>
  static create<TError>(result: Failure<TError>): Observable<Result<never, TError>>
  static create<TInput>(result: Success<TInput>): Observable<Result<TInput, never>>
  static create<TInput, TError>(result: Result<TInput, TError>): Observable<Result<TInput, TError>> {
    return of(result);
  }
}

export function map$<TInput, TInputError, TOutput, TOutputError>(
  myFunction: (input: TInput) => Result<TOutput, TOutputError> | Promise<Result<TOutput, TOutputError>>
): OperatorFunction<Result<TInput, TInputError>, Result<TOutput, TOutputError | TInputError>> {
  return pipe(
    switchMap(input => {
      switch (input.tag) {
        case 'loading':
          return of(input);
        case 'failure':
          return of(input);
        default:
          return Promise.resolve(myFunction(input.value))
      }
    })
  )
}

export const validate = (input: unknown): Result<number, 'NOT_AN_INTEGER'> => {
  if (Number.isInteger(input))
    return {
      tag: 'success',
      value: input as number
    }

  return {
    tag: 'failure',
    value: 'NOT_AN_INTEGER'
  };
};

export const validate2 = (input: number): Result<string, 'NOT_AN_INTEGER_2'> => {
  if (input === 2) {
    return {
      tag: 'failure',
      value: "NOT_AN_INTEGER_2"
    };
  }
  return {
    tag: 'success',
    value: input.toString()
  };
};

export const validate3 = (input: string): Result<boolean, 'NOT_AN_INTEGER_3'> => {
  if (input.length === 3) {
    return {
      tag: 'failure',
      value: "NOT_AN_INTEGER_3"
    };
  }
  return {
    tag: 'success',
    value: true
  };
};

export const validate4Async = async (input: boolean): Promise<Result<string, 'NOT_AN_INTEGER_4'>> => {
  await lastValueFrom(timer(500));

  if (input === false)
    return {
      tag: 'failure',
      value: "NOT_AN_INTEGER_4"
    }
  return {
    tag: 'success',
    value: 'Hello World'
  }
};

export function example() {
  ResultFactory.create({
    tag: 'success',
    value: 1
  } as Success<number>).pipe(
    map$(validate),
    map$(validate2),
  ).subscribe(console.log)
}