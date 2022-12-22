import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Subject } from 'rxjs';

export interface IEagerComponentInputs {
  prop1: string,
  prop2: number
}

export type IDataInputs$<T> = {
  [K in keyof T]: Subject<T[K]>;
};

export type IDataInputs<T> = {
  [K in keyof T]: {
    value?: T[K],
    defaultValue?: T[K],
    type?: T[K] | undefined // For errors in HTML.
  } | undefined | null
};

export interface IData<T> {
  data: IDataInputs$<T>
}

@Component({
  selector: 'eager',
  templateUrl: './eager.component.html',
  styleUrls: ['./eager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EagerComponent implements IData<IEagerComponentInputs> {
  @Input() set data(data: IDataInputs$<IEagerComponentInputs>) {
    data.prop2.subscribe(console.log);
    data.prop1.subscribe(console.log);
  }
}
