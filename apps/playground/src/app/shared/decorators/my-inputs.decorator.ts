import { InjectableType, ɵComponentType as ComponentType, ɵDirectiveType as DirectiveType } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

function decorateNgOnInit(
  ngOnInit: (() => void) | null | undefined,
) {
  return function (this: any) {
    if (ngOnInit)
      ngOnInit.call(this);
  };
}

function decorateProviderDirectiveOrComponentWithOnInit<T>(
  type: InjectableType<T> | DirectiveType<T> | ComponentType<T>,
): void {
  type.prototype.ngOnInit = decorateNgOnInit(type.prototype.ngOnInit);

  Object.defineProperty(type.prototype, 'optionalData', {
    configurable: true,
    set: function (data) {
      if (data) {
        for (const [_key, _value] of Object.entries(data)) {
          if (!this.optionalProps$[_key]) {
            this.optionalProps$[_key] = new ReplaySubject<any>(1);
          }
          (_value as Observable<unknown>).subscribe(this.optionalProps$[_key]);
        }
      }
    }
  });
}

export function MyInputs(): ClassDecorator {
  return (type: any) => decorateProviderDirectiveOrComponentWithOnInit(type);
}
