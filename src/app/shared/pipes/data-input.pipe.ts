import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { IDataInputs, IDataInputs$ } from 'src/app/eager/eager.component';
import { nameof } from '../models/helpers/nameof.helper';

export type IDataInputsOptional$<T> = {
  [K in keyof T]?: Subject<T[K]>;
};

@Pipe({
  name: 'dataInput'
})
export class DataInputPipe implements PipeTransform {
  transform<T>(objProps: IDataInputs<T>): IDataInputs$<T> {
    const _objProps = objProps as Record<string, { value?: unknown, defaultValue?: unknown } | undefined>;
    const response: Record<string, unknown> = {};
    for (const [_key, _value] of Object.entries(_objProps)) {
      if (!_value) {
        response[_key] = new ReplaySubject<any>(1);
      }
      else if (_value.hasOwnProperty(nameof<{ value?: unknown, defaultValue?: unknown }>('value'))) {
        response[_key] = new BehaviorSubject<any>(_value.value);
      }
      else if (_value.hasOwnProperty(nameof<{ value?: unknown, defaultValue?: unknown }>('defaultValue'))) {
        response[_key] = new BehaviorSubject<any>(_value.defaultValue);
      }
      else {
        response[_key] = new ReplaySubject<any>(1);
      }
    }
    return response as IDataInputs$<T>;
  }
}
