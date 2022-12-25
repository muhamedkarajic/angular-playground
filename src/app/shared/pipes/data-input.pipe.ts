import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { v4 } from 'uuid';
import { nameof } from '../models/helpers/nameof.helper';

export type IDataInputs$<T> = {
  [K in keyof T]: Subject<T[K]>;
};

export type IDataInputs<T> = {
  [K in keyof T]: {
    value?: T[K] | null | undefined,
    defaultValue?: T[K],
    type?: T[K] | undefined // For errors in HTML.
  } | undefined | null
};

export interface IData<T extends Record<string, unknown>> {
  data: IDataInputs$<T>
}

export type IDataInputsOptional$<T> = {
  [K in keyof T]?: Subject<T[K]>;
};

const dataInputObsPropsByPipeUUID: Record<string, Record<string, Subject<unknown>> | undefined> = {}
@Pipe({
  name: 'input'
})
export class InputPipe implements PipeTransform {
  uuid = v4();

  transform<T>(objProps: IDataInputs<T>): IDataInputs$<T> {
    const _objProps = objProps as Record<string, { value?: unknown, defaultValue?: unknown } | undefined>;
    const dataInputObsProps = dataInputObsPropsByPipeUUID[this.uuid];

    if (!dataInputObsProps) { // creates the obj with observable props
      const newDataInputObsProps: Record<string, unknown> = {};
      for (const [_key, _value] of Object.entries(_objProps)) {
        if (!_value) {
          newDataInputObsProps[_key] = new ReplaySubject<any>(1);
        }
        else if (_value.hasOwnProperty(nameof<{ value?: unknown, defaultValue?: unknown }>('value')) && _value.value !== null) {
          newDataInputObsProps[_key] = new BehaviorSubject<any>(_value.value);
          (newDataInputObsProps[_key] as any).cachedValue = _value.value;
        }
        else if (_value.hasOwnProperty(nameof<{ value?: unknown, defaultValue?: unknown }>('defaultValue'))) {
          newDataInputObsProps[_key] = new BehaviorSubject<any>(_value.defaultValue);
          (newDataInputObsProps[_key] as any).cachedValue = _value.defaultValue;
        }
        else {
          newDataInputObsProps[_key] = new ReplaySubject<any>(1);
        }
      }

      dataInputObsPropsByPipeUUID[this.uuid] = newDataInputObsProps as Record<string, Subject<unknown>>;

      return newDataInputObsProps as IDataInputs$<T>;
    }

    for (const [_key, _value] of Object.entries(_objProps)) { // calls next on observables
      if (_value?.hasOwnProperty(nameof<{ value?: unknown, defaultValue?: unknown }>('value')) && _value.value !== null) {
        if (dataInputObsProps[_key].hasOwnProperty('cachedValue') && (dataInputObsProps[_key] as any).cachedValue === _value.value)
          continue;

        (dataInputObsProps[_key] as any).cachedValue = _value.value;
        dataInputObsProps[_key].next(_value.value);
      }
      else if (_value?.hasOwnProperty(nameof<{ value?: unknown, defaultValue?: unknown }>('defaultValue'))) {
        if (dataInputObsProps[_key].hasOwnProperty('cachedValue') && (dataInputObsProps[_key] as any).cachedValue === _value.defaultValue)
          continue;

        (dataInputObsProps[_key] as any).cachedValue = _value.defaultValue;
        dataInputObsProps[_key].next(_value.defaultValue);
      }
    }
    return null as unknown as IDataInputs$<T>;
  }
}
