import { assign, createMachine } from "xstate";
import { IEntity } from "./shared/models/entity/i-entity";

export const machine = createMachine({
    initial: 'toggledOn',
    schema: {
        events: {} as
            { type: "TOGGLE_ON" } |
            { type: "TOGGLE_OFF", someValue?: number } |
            { type: "BREAK" },
        context: {} as IEntity
    },
    tsTypes: {} as import("./machine.typegen").Typegen0,
    context: {
        id: '1',
        name: 'Station',
        version: 1
    },
    states: {
        toggledOn: {
            on: {
                TOGGLE_OFF: { target: "toggledOff", actions: 'test' },
                BREAK: "broken"
            },
        },
        toggledOff: {
            on: {
                TOGGLE_ON: { target: "toggledOn", actions: 'test' },
                BREAK: "broken"
            }
        },
        broken: {},
    },
},
    {
        actions: {
            test: assign((context, event) => {
                return {
                    ...context,
                    name: 'test',
                    someValue: (event as any)?.someValue
                }
            })
        }
    }
);
