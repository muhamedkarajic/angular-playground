import { lastValueFrom, timer } from 'rxjs';
import { createMachine } from "xstate";

const lit = {
  entry: ['action1'],
  on: {
    BREAK: 'broken',
    TOGGLE: {
      target: 'unlit',
    }
  }
};
const unlit = {
  exit: [(ctx: any, event: any) => {
    console.log('exit unlit ctx', ctx);
    console.log('exit unlit event', event);
  }],
  on: {
    BREAK: {
      target: 'broken',
      actions: [async (ctx: any, event: any) => {
        await lastValueFrom(timer(600))
        console.log('ctx', ctx);
        console.log('event', event);
      }]
    },
    TOGGLE: 'lit'
  }
};

const broken = {
};

const states = { lit: lit, unlit: unlit, broken: {} };


const config = {
  id: 'lightBlub',
  initial: 'lit',
  states,
  strict: true
}



export const machine = createMachine(config, {
  actions: {
    action1: (ctx: any, event: any) => {
      console.log('entry lit ctx', ctx);
      console.log('entry lit event', event);
    }
  }
});