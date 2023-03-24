export class User {
    constructor(
        readonly username: string,
        readonly firstName: string,
        readonly lastName: string,
    ) { }
}

export function extension(ctr: any) {
    let originalFunction: Function;
    return function (_: any, propertyKey: string, descriptor: PropertyDescriptor) {
        originalFunction = descriptor.value;

        ctr.prototype[propertyKey] = function (...args: any) {
            return originalFunction(this, ...args);
        }
    }
}

export class SavedUserAccount extends User {
    constructor(
        readonly id: string,
        override readonly username: string,
        override readonly firstName: string,
        override readonly lastName: string
    ) {
        super(username, firstName, lastName);
    }
}