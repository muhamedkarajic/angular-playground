// import { IStore } from '@example-lib';

// declare module '@example-lib' {
//     interface IStore {
//         foo(): string;
//     }
// }

// IStore.prototype.foo = function(this: IStore): string {
//     return "hi!";
// }

//inside example-lib
export interface IStore {
    x(): string;
}

export interface IStoreConstructor {
    new(value?: any): IStore;
    readonly prototype: IStore;
}

export class StoreImplementation
{
    x(): string {
        return "Hello World";
    }
}

export var IStore: IStoreConstructor = StoreImplementation as IStoreConstructor;


//inside app.component
// let storeX: IStore = new IStore();
// console.log('foo',storeX.foo());
// console.log('x',storeX.x());