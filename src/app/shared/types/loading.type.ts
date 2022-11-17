import { Result } from "true-myth";

export type IsLoading_v2 = 'LOADING';

let isLoading!: IsLoading;
let isLoadingResult!: Result<IsLoading, never>;

export class IsLoading {
    private constructor() { }

    public static instance(): IsLoading {
        if (!isLoading) {
            isLoading = new IsLoading();
            isLoadingResult = Result.ok<IsLoading, never>(isLoading);
        }
        return isLoading;
    }

    // youtube.com/watch?v=Fgcu_iB2X04
    // static instanceType(value: unknown): InstanceType<IsLoading>{
    //     return value instanceof IsLoading
    // }

    public static get<T, E>(): Result<T | IsLoading, E> {
        return isLoadingResult as unknown as Result<T | IsLoading, E>
    }
}

IsLoading.instance();