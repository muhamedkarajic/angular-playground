import { lastValueFrom, map, Observable, of, OperatorFunction, pipe, switchMap, timer } from "rxjs";

export type Success<T> = { tag: 'success', value: T };
export type Failure<S> = { tag: 'failure', value: S };
export type Loadingx = { tag: 'loading' };
export type Loading = 'LOADING';
export type Result<T, S> = Success<T> | Failure<S> | Loadingx;

export class ResultFactory {
  static create<S>(result: Failure<S>): Observable<Result<never, S>>
  static create<T>(result: Success<T>): Observable<Result<T, never>>
  static create<T = never, S = never>(result: Result<T, S>): Observable<Result<T, S>> {
    return of(result);
  }
}

const switchMapChainer = <I, O, E>(f: (a: I) => Promise<Result<O, E>>) =>
  <F>(result: Result<I, F>): Observable<Result<O, E | F>> | Promise<Result<O, E | F>> => {
    if (result.tag === 'loading')
      return of(result);
    else if (result.tag === 'failure') {
      return of(result as unknown as Failure<E | F>);
    }
    return f(result.value);
  };

export function map_old$<TInput, TOutput, TInputError, TOutputError>(
  myFunction: (input: TInput) => Result<TOutput, TOutputError>
): OperatorFunction<Result<TInput, TInputError>, Result<TOutput, TOutputError | TInputError>> {
  return pipe(
    map(input => {
      switch (input.tag) {
        case 'loading':
          return input;
        case 'failure':
          return input;
        default:
          return myFunction(input.value);
      }
    })
  );
}

export function switchMap$<TInput, TOutput, TInputError, TOutputError>(
  myFunction: (input: TInput) => Promise<Result<TOutput, TOutputError>>
): OperatorFunction<Result<TInput, TInputError>, Result<TOutput, TOutputError | TInputError>> {
  return pipe(
    switchMap(input => {
      const myChainedFunction = switchMapChainer(myFunction)
      const result = myChainedFunction(input);
      return result;
    })
  );
}


export class Foo {
  static map$<TInput, TInputError, TOutput, TOutputError>(
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
}

export function map$<TInput, TOutput, TOutputError, TInputError>(
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
  );
}



const tee = <T, E>(f: (a: unknown) => Result<T, E>) =>
  (result: Result<T, E>): Result<T, E> => {
    if (result.tag !== 'loading' && result.tag === 'success')
      f(result.value);
    return result;
  };

export type FailedType = true;

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


const log = (input: unknown): void => {
  console.log(input);
}
