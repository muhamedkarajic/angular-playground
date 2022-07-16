import { timeout, catchError, throwError, take, Observable, Observer, ReplaySubject } from "rxjs";

type UnsetValues = undefined | null | '' | false;

interface IRequiredConfig {
    allowedValues: UnsetValues[];
    disallowedValues: UnsetValues[];
    IsDisallowingNaN: boolean;
    timeoutMilliseconds: number;
}
const defaultRequiredConfig: IRequiredConfig = {
    allowedValues: [],
    disallowedValues: [undefined, null],
    IsDisallowingNaN: true,
    timeoutMilliseconds: 100
}

export const Required = (config?: Partial<IRequiredConfig>) =>
    (target: any, key: string) => {
        let subject$: ReplaySubject<any>;

        const mergedConfig = config ? {...defaultRequiredConfig, ...config} : defaultRequiredConfig;

        Object.defineProperty(target, key, {
            configurable: false,
            get: () => subject$,
            set: (value$: ReplaySubject<any>) => {
                const observer: Observer<any> = {
                    next: (value) => {
                        if (mergedConfig.disallowedValues && mergedConfig.disallowedValues.some(v => v === value))
                            throw new Error(`${target.constructor.name}: Property ${key} can't be ${value}.`);
                        if (mergedConfig.allowedValues && mergedConfig.allowedValues.some(x => x === value))
                            return;
                        if (mergedConfig.allowedValues && mergedConfig.allowedValues.some(x => x === value))
                            return;
                        if (value === undefined || value === null || (mergedConfig.allowedValues && value === NaN))
                            throw new Error(`${target.constructor.name}: Property ${key} can't be ${value}.`);
                        return value;
                    },
                    error: () => {},
                    complete: () => {}
                };

                value$.subscribe(observer);

                subject$ = value$;
            }
        });
    }