import { InjectableType, ɵComponentType as ComponentType, ɵDirectiveType as DirectiveType } from '@angular/core';
import { catchError, ReplaySubject, Subject, take, throwError, timeout } from 'rxjs';

function decorateNgOnInit(
  ngOnInit: (() => void) | null | undefined,
) {
  return function (this: any) {

    const props$: Record<string, Subject<unknown>> = this['props$'];
    const props = Object.values(this.constructor.ɵcmp.inputs) as string[];

    props.forEach(prop => {
      props$[prop].pipe(
        take(1),
        timeout(0),
        catchError(err => {
          return throwError(() => new Error(`${this.constructor.name}: ${prop} required as input.`))
        })
      ).subscribe()
    });

    if (ngOnInit)
      ngOnInit.call(this);
  };
}

function decorateProviderDirectiveOrComponentWithOnInit<T>(
  type: InjectableType<T> | DirectiveType<T> | ComponentType<T>,
): void {
  type.prototype.ngOnInit = decorateNgOnInit(type.prototype.ngOnInit);

  const props = Object.values(type.prototype.constructor.ɵcmp.inputs) as string[];

  const props$: Record<string, Subject<unknown>> = {};
  const prototype_ = type.prototype;

  Object.defineProperty(prototype_, 'props$', {
    configurable: true,
    get: function () {
      return props$;
    }
  });

  props.forEach(prop => {

    props$[prop] = new ReplaySubject<unknown>(1);

    const mergedConfigGetterOfProp = Object.getOwnPropertyDescriptor(prototype_, prop);
    if (!mergedConfigGetterOfProp?.set)
      Object.defineProperty(prototype_, prop, {
        configurable: true,
        set: function (value) {
          console.log('Replaced setter call: ', value);
          props$[prop].next(value);
        }
      });
  });
}

export function SimpleInputs(): ClassDecorator {
  return (type: any) => decorateProviderDirectiveOrComponentWithOnInit(type);
}
