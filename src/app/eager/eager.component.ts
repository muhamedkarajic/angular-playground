import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

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

export interface IData<T extends Record<string, unknown>> extends OnInit {
  data: IDataInputs$<T>
}

export interface IEagerComponentInputs extends Record<string, unknown> {
  prop1: string,
  prop2: number,
}

@Component({
  selector: 'eager',
  templateUrl: './eager.component.html',
  styleUrls: ['./eager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EagerComponent implements IData<IEagerComponentInputs> {
  _data!: IDataInputs$<IEagerComponentInputs>;

  @Input() set data(data: IDataInputs$<IEagerComponentInputs>) {
    if (data)
      this._data = data;
  }

  ngOnInit(): void {
    this._data.prop1.subscribe(console.log);
    this._data.prop2.subscribe(console.log);
  }
}
