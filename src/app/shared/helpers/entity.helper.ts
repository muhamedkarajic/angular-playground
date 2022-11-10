import { Entity } from "../models/entity.model";

export function defaultError(entityRef: Entity, functionName: (...args: any) => unknown): Error {
    return Error(`${entityRef.state$.value.constructor.name} state isn't supporting '${functionName.name}' function.`);
}