import { lastValueFrom, timer } from "rxjs";
import { Result } from "true-myth";
import { v4 } from "uuid";
import { SavedUserAccount, User } from "../models/user.model";
import { IsLoading } from "../types/loading.type";

export enum UserValidationError {
    USERNAME_EMPTY = 'Username cannot be empty!',
    USERNAME_INVALID_CHARS = 'Username must only contain alphanumeric chars and dashes/underscores'
}

export const VALID_USERNAME_REGEX = /^[A-Za-z0-9_-]+$/;

export enum UserSaveError {
    DB_SAVE_FAILED = "Failed saving user to the database!"
}

export type UserError = UserValidationError | UserSaveError;

export async function saveUser(input: User | IsLoading): Promise<Result<SavedUserAccount | IsLoading, UserSaveError>> {
    if(input instanceof IsLoading)
        return IsLoading.get();
    
    // Let's pretend we made a call to our user database to save the user and
    //  this is the new user's user ID
    await lastValueFrom(timer(50));

    if (Math.random() * 2 > 1 ? true : false)
        return Promise.resolve(Result.err(UserSaveError.DB_SAVE_FAILED))

    const savedUser = new SavedUserAccount(v4(), input.username, input.firstName, input.lastName);
    return Promise.resolve(Result.ok(savedUser));
}

export async function validateUsernameNotEmpty(input: User | IsLoading): Promise<Result<User | IsLoading, UserValidationError>> {
    await lastValueFrom(timer(50));
    if(input instanceof IsLoading)
        return IsLoading.get();

    if (input.username.length === 0)
        return Result.err(UserValidationError.USERNAME_EMPTY);

    return Result.ok(input);
}

export function validateUsernameHasValidChars(input: User | IsLoading): Result<User | IsLoading, UserValidationError | UserError> {
    if(input instanceof IsLoading)
        return IsLoading.get();
    
    if (!input.username.match(VALID_USERNAME_REGEX))
        return Result.err(UserValidationError.USERNAME_INVALID_CHARS);
    return Result.ok(input);
}

export function printSavedUser(input: SavedUserAccount) {
}

export function printError(error: UserError) {
    console.log('User is invalid: ', error);
}