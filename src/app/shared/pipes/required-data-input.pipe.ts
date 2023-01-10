import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { v4 } from 'uuid';

export type IRequiredDataInputs$<T> = {
  [K in keyof T]: Subject<T[K] | undefined>;
};

export type IRequiredDataInputs<T> = {
  [K in keyof T]: {
    value: T[K] | 'LOADING',
  }
};

export interface IRequiredData<T extends Record<string, any>> {
  requiredData: IRequiredDataInputs$<T>
}

export type IDataInputsRequired$<T> = {
  [K in keyof T]?: Subject<T[K]>;
};

const dataInputObsPropsByPipeUUID: Record<string, Record<string, Subject<any>> | undefined> = {}
@Pipe({
  name: 'requiredInput'
})
export class RequiredInputPipe implements PipeTransform {
  uuid = v4();

  transform<T>(objProps: IRequiredDataInputs<T>): IRequiredDataInputs$<T> {
    const _objProps = objProps as Record<string, { value: any | 'LOADING' }>;
    const dataInputObsProps = dataInputObsPropsByPipeUUID[this.uuid];

    if (!dataInputObsProps) { // creates the obj with observable props
      const newDataInputObsProps: Record<string, any> = {};
      for (const [_key, _value] of Object.entries(_objProps)) {
        if (!_value) {
          newDataInputObsProps[_key] = new ReplaySubject<any>(1);
        }
        else if (_value.value !== 'LOADING') {
          newDataInputObsProps[_key] = new BehaviorSubject<any>(_value.value);
          (newDataInputObsProps[_key] as any).cachedValue = _value.value;
        }
        else {
          newDataInputObsProps[_key] = new ReplaySubject<any>(1);
        }
      }

      dataInputObsPropsByPipeUUID[this.uuid] = newDataInputObsProps as Record<string, Subject<any>>;

      return newDataInputObsProps as IRequiredDataInputs$<T>;
    }

    for (const [_key, _value] of Object.entries(_objProps)) { // calls next on observables
      if (_value.value !== 'LOADING') {
        if (dataInputObsProps[_key].hasOwnProperty('cachedValue') && (dataInputObsProps[_key] as any).cachedValue === _value)
          continue;

        (dataInputObsProps[_key] as any).cachedValue = _value;
        dataInputObsProps[_key].next(_value);
      }
    }
    return null as any as IRequiredDataInputs$<T>;
  }
}
