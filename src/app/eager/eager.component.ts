import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IData, IDataInputs$ } from '../shared/pipes/data-input.pipe';

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
export class EagerComponent implements IData<IEagerComponentInputs>, OnInit {
  props = {
    prop1: new BehaviorSubject<string>('hello world'),
    prop2: new BehaviorSubject<number>(2)
  } as IDataInputs$<IEagerComponentInputs>;

  @Input() set data(data: IDataInputs$<IEagerComponentInputs>) {
    if (data) {
      for (const [_key, _value] of Object.entries(data)) {
        _value.subscribe(this.props[_key]);
      }
    }
  }

  ngOnInit(): void {
    this.props.prop1.subscribe(console.log);
    this.props.prop2.subscribe(console.log);
  }
}
