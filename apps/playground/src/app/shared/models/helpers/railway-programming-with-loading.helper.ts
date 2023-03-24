import { map, of } from "rxjs";

// Ref: https://www.youtube.com/watch?v=AqeR-Fn75Sw
type Success<T> = { tag: 'success', value: T };
type Failure<S> = { tag: 'failure', value: S };
type Loading = 'LOADING';
type ResultOrLoading<T, S> = Success<T> | Failure<S> | Loading;

const chain = <I, O, E>(f: (a: I) => ResultOrLoading<O, E>) =>
  <F>(result: ResultOrLoading<I, F>): ResultOrLoading<O, E | F> => {
    if (result === 'LOADING')
      return result;
    else if (result.tag === 'failure') {
      return result as unknown as Failure<E | F>;
    }
    return f(result.value);
  };

const tee = <T, E>(f: (a: unknown) => ResultOrLoading<T, E>) =>
  (result: ResultOrLoading<T, E>): ResultOrLoading<T, E> => {
    if (result !== 'LOADING' && result.tag === 'success')
      f(result.value);
    return result;
  };

type FailedType = true;

const validate = (input: unknown): ResultOrLoading<number, 'NOT_AN_INTEGER'> => {
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

const validate2 = (input: number): ResultOrLoading<string, 'NOT_AN_INTEGER_2'> => {
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

const validate3 = (input: string): ResultOrLoading<boolean, 'NOT_AN_INTEGER_3'> => {
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

const log = (input: unknown): void => {
  console.log(input);
}

const x: ResultOrLoading<string, FailedType> = {
  tag: 'success',
  value: 'hello'
};

of(x).pipe(
  map(validate),
  map(x => {
    const y = chain(validate2)
    const z = y(x);
    return z;
  }),
  map(x => {
    const y = chain(validate3)
    const z = y(x);
    return z;
  }),
  // map(x => { return tee(log) })
).subscribe(x => {

})
