export type UnsetValues = undefined | null | typeof NaN | '' | 0 | false;

export interface IRequiredConfig {
    allowedValues: UnsetValues[];
    disallowedValues: UnsetValues[];
}
const defaultRequiredConfig: IRequiredConfig = {
    allowedValues: [],
    disallowedValues: [undefined, null, NaN],
}
export const Required = (config?: Partial<IRequiredConfig>) =>
    (target: any, key: string) => {
        let configuration = config ? {...defaultRequiredConfig, ...config} : defaultRequiredConfig;
        Object.defineProperty(target, `__${key}__config`, {
            configurable: true,
            get: () => configuration,
            set: (value) => configuration = value
        });
    }
