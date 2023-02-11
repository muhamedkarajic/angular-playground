export class Optional<T>
{
    private constructor(private _object: T | null) { }

    static some<T>(object: T): Optional<T> {
        return new Optional<T>(object);
    }

    static none<T>(): Optional<T> {
        return new Optional<T>(null);
    }

    map<TResult>(map: (object: T) => TResult): Optional<TResult> {
        return this._object ? Optional.some<TResult>(map(this._object)) : Optional.none<TResult>();
    }

    reduce($default: T): T {
        return this._object ?? $default;
    }
}

export class Person {
    constructor(
        public firstName: string,
        public lastName: Optional<string>
    ) { }
}

export function optionalExample() {

    let person = new Person(
        'Muhamed',
        // Option.none()
        Optional.some<string>('Karajic')
    );

    const greetings = person.lastName
        .map(myString => `Hello ${person.firstName} ${myString}`)
        .reduce(`Hi ${person.firstName}`);

    console.log(greetings);
}