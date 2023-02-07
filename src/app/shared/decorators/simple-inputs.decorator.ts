import { InjectableType, ɵComponentType as ComponentType, ɵDirectiveType as DirectiveType } from '@angular/core';
import { BehaviorSubject, catchError, ReplaySubject, Subject, take, throwError, timeout } from 'rxjs';

function decorateNgOnInit(
  ngOnInit: (() => void) | null | undefined,
) {
  return function (this: any) {

    const props = Object.values(this.constructor.ɵcmp.inputs) as string[];

    props.forEach(prop => {


      let prop$: Subject<unknown> | undefined = this[`${prop}$`];
      if (!prop$) {
        if (this[prop])
          prop$ = new BehaviorSubject<unknown>(this[prop]);
        else
          prop$ = new ReplaySubject<unknown>(1);
        this[`${prop}$`] = prop$;
      }
      prop$.pipe(
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

  const prototype_ = type.prototype;

  props.forEach(prop => {

    const mergedConfigGetterOfProp$ = Object.getOwnPropertyDescriptor(prototype_, `${prop}$`);

    if (!mergedConfigGetterOfProp$) {
      const x$ = new ReplaySubject<never>();
      Object.defineProperty(prototype_, `${prop}$`, {
        configurable: true,
        get: function () {
          return x$;
        }
      });
    }

    const mergedConfigGetterOfProp = Object.getOwnPropertyDescriptor(prototype_, prop);
    if (!mergedConfigGetterOfProp?.set)
      Object.defineProperty(prototype_, prop, {
        configurable: true,
        set: function (value) {
          this[`${prop}$`].next(value);
        }
      });
  });
}

export function SimpleInputs(): ClassDecorator {
  return (type: any) => decorateProviderDirectiveOrComponentWithOnInit(type);
}
