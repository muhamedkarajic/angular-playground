export class User {
    constructor(
        readonly username: string,
        readonly firstName: string,
        readonly lastName: string,
    ) { }
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
