
// Ref: https://www.youtube.com/watch?v=AqeR-Fn75Sw
export type Success<T> = { tag: 'success', value: T };
export type Failure<S> = { tag: 'failure', value: S };
export type Result<T, S> = Success<T> | Failure<S>;

const chain = <I, O, E>(f: (a: I) => Result<O, E>) =>
  <F extends E>(result: Result<I, F>): Result<O, E | F> => {
    if (result.tag === 'failure') {
      return result;
    }
    return f(result.value);
  };

type FailedType = true;

const validate = (input: unknown): Result<number, 'NOT_AN_INTEGER'> => {
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


const x: Result<string, FailedType> = {
  tag: 'success',
  value: 'hello'
};

const result = chain(validate);

const y = result(x);

if (y.tag === 'success') {
  y.value;
}
else if (y.tag === 'failure') {
  y.value
}