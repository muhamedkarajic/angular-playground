import {
  InjectableType,
  ɵComponentType as ComponentType,
  ɵDirectiveType as DirectiveType,
} from '@angular/core';
import { catchError, Observable, Subscription, throwError, timeout, take } from 'rxjs';

import { PipeType, isPipe } from './ivy';
import {
  getSymbol,
  UntilDestroyOptions,
  completeSubjectOnTheInstance,
  markAsDecorated,
} from './internals';

function unsubscribe(property: unknown): void {
  if (property instanceof Subscription) {
    property.unsubscribe();
  }
}

function unsubscribeIfPropertyIsArrayLike(property: unknown[]): void {
  Array.isArray(property) && property.forEach(unsubscribe);
}

function decorateNgOnDestroy(
  ngOnDestroy: (() => void) | null | undefined,
  options: UntilDestroyOptions
) {
  return function (this: any) {
    // Invoke the original `ngOnDestroy` if it exists
    ngOnDestroy && ngOnDestroy.call(this);

    // It's important to use `this` instead of caching instance
    // that may lead to memory leaks
    completeSubjectOnTheInstance(this, getSymbol());

    // Check if subscriptions are pushed to some array
    if (options.arrayName) {
      unsubscribeIfPropertyIsArrayLike(this[options.arrayName]);
    }

    // Loop through the properties and find subscriptions
    if (options.checkProperties) {
      for (const property in this) {
        if (options.blackList?.includes(property)) {
          continue;
        }

        unsubscribe(this[property]);
      }
    }
  };
}

function getComponentMeta(compType: any): { inputs: any[], outputs: any[] } {
  const props = compType.__prop__metadata__;
  const inputs = [];
  const outputs = [];
  for (const prop in props) {
    const member = props[prop][0];
    if (member.ngMetadataName === 'Input') {
      inputs.push(prop);
    } else if (member.ngMetadataName === 'Output') {
      outputs.push(prop);
    }
  }
  return {
    inputs: inputs.sort(),
    outputs: outputs.sort()
  };
}

function decorateNgOnInit(
  ngOnInit: (() => void) | null | undefined,
  options: UntilDestroyOptions
) {
  return function (this: any) {


    // Invoke the original `ngOnInit` if it exists
    ngOnInit && ngOnInit.call(this);

    const props = Object.values(this.constructor.ɵcmp.inputs) as string[];

    props.forEach(prop => {
      const obs$ = this[`${prop}$`] as Observable<unknown>;

      obs$.pipe(
        timeout(0),
        catchError(() => throwError(() => new Error(`${this.constructor.name}: ${prop} required as input.`))),
        take(1)
      ).subscribe(value => {
      });
    });


    // It's important to use `this` instead of caching instance
    // that may lead to memory leaks
    completeSubjectOnTheInstance(this, getSymbol());

    // Check if subscriptions are pushed to some array
    if (options.arrayName) {
      unsubscribeIfPropertyIsArrayLike(this[options.arrayName]);
    }

    // Loop through the properties and find subscriptions
    if (options.checkProperties) {
      for (const property in this) {
        if (options.blackList?.includes(property)) {
          continue;
        }

        unsubscribe(this[property]);
      }
    }
  };
}

function decorateProviderDirectiveOrComponent<T>(
  type: InjectableType<T> | DirectiveType<T> | ComponentType<T>,
  options: UntilDestroyOptions
): void {
  type.prototype.ngOnDestroy = decorateNgOnDestroy(type.prototype.ngOnDestroy, options);
}

function decorateProviderDirectiveOrComponentWithOnInit<T>(
  type: InjectableType<T> | DirectiveType<T> | ComponentType<T>,
  options: UntilDestroyOptions
): void {
  type.prototype.ngOnInit = decorateNgOnInit(type.prototype.ngOnInit, options);
}

function decoratePipe<T>(type: PipeType<T>, options: UntilDestroyOptions): void {
  const def = type.ɵpipe;
  def.onDestroy = decorateNgOnDestroy(def.onDestroy, options);
}

const nameof = <T>(name: keyof T) => name;

export function RequiredInputs<T>(config: Partial<{[P in keyof T]: boolean}>): ClassDecorator {
  return (type: any) => {
    if (isPipe(type)) {
      decoratePipe(type, config);
    } else {
      decorateProviderDirectiveOrComponentWithOnInit(type, config);
    }

    markAsDecorated(type);
  };
}
