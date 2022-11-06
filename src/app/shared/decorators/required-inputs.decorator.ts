import { InjectableType, ɵComponentType as ComponentType, ɵDirectiveType as DirectiveType } from '@angular/core';
import { catchError, Observable, throwError, timeout, take, combineLatest, of, ReplaySubject } from 'rxjs';
import { IRequiredConfig } from './required.decorator';

function decorateNgOnInit(
  ngOnInit: (() => void) | null | undefined,
) {
  return function (this: any) {
    if (ngOnInit)
      ngOnInit.call(this);

    const props = Object.values(this.constructor.ɵcmp.inputs) as string[];
    // if(!props || !props.length)
    //   throw new Error(`${this.constructor.name} has no input props therefor ${RequiredInputs.name} decorator is useless.`);

    props.forEach(prop => {
      const obs$ = this[`${prop}$`] as Observable<unknown> | undefined;

      if (!obs$)
        throw new Error(`${this.constructor.name}: Property ${prop} missing corresponding ReplaySubject called: ${prop}$.`);

      if (obs$ instanceof ReplaySubject)
        combineLatest([of(this), obs$]).pipe(
          timeout(0),
          catchError(() => throwError(() => new Error(`${this.constructor.name}: ${prop} required as input.`))),
          take(1)
        ).subscribe(([self, value]) => { });
    });
  };
}

function decorateProviderDirectiveOrComponentWithOnInit<T>(
  type: InjectableType<T> | DirectiveType<T> | ComponentType<T>,
): void {
  type.prototype.ngOnInit = decorateNgOnInit(type.prototype.ngOnInit);

  const props = Object.values(type.prototype.constructor.ɵcmp.inputs) as string[];

  props.forEach(prop => {
    const prototype_ = type.prototype;
    const configProp = `__${prop}__config`;
    const mergedConfigGetter = Object.getOwnPropertyDescriptor(prototype_, configProp);
    const mergedConfigGetterOfProp = Object.getOwnPropertyDescriptor(prototype_, prop);

    if (mergedConfigGetter && mergedConfigGetterOfProp) {
      Object.defineProperty(prototype_, prop, {
        configurable: true,
        set: function (value) {
          console.log('Replaced setter call: ', value);

          const mergedConfig: IRequiredConfig = mergedConfigGetter.get!();
          if (mergedConfig.disallowedValues && mergedConfig.disallowedValues.some(v => v === value))
            throw new Error(`${this.constructor.name}: Property ${prop} can't be ${value}.`);
          if (mergedConfig.allowedValues && mergedConfig.allowedValues.some(x => x === value))
            return;
          if (mergedConfig.allowedValues && mergedConfig.allowedValues.some(x => x === value))
            return;
          if (value === undefined || value === null || (mergedConfig.allowedValues && value === NaN))
            throw new Error(`${this.constructor.name}: Property ${prop} can't be ${value}.`);

          mergedConfigGetterOfProp.set!.call(this, value);
        }
      });
    }
  });
}

export function RequiredInputs(): ClassDecorator {
  return (type: any) => decorateProviderDirectiveOrComponentWithOnInit(type);
}
