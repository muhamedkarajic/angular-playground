import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { IDataInputs, IDataInputs$ } from 'src/app/eager/eager.component';
import { nameof } from '../models/helpers/nameof.helper';

export type IDataInputsOptional$<T> = {
  [K in keyof T]?: Subject<T[K]>;
};

const obs: Record<string, Record<string, Subject<unknown>> | undefined> = {

}

@Pipe({
  name: 'dataInput'
})
export class DataInputPipe implements PipeTransform {
  transform<T>(objProps: IDataInputs<T>, uuid: string): IDataInputs$<T> {
    const _objProps = objProps as Record<string, { value?: unknown, defaultValue?: unknown } | undefined>;
    const response: Record<string, unknown> = {};

    const objProps$ = obs[uuid];
    if (!objProps$) {
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

      obs[uuid] = response as Record<string, Subject<unknown>>;

      return response as IDataInputs$<T>;
    }

    for (const [_key, _value] of Object.entries(_objProps)) {
      if (_value?.hasOwnProperty(nameof<{ value?: unknown, defaultValue?: unknown }>('value'))) {
        objProps$[_key].next(_value.value);
      }
      else if (_value?.hasOwnProperty(nameof<{ value?: unknown, defaultValue?: unknown }>('defaultValue'))) {
        objProps$[_key].next(_value.defaultValue);
      }
    }
    return null as unknown as IDataInputs$<T>;
  }
}
