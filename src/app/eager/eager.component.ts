import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MyInputs } from '../shared/decorators/my-inputs.decorator';
import { IData, IDataInputs$, IDataInputsFull$ } from '../shared/pipes/data-input.pipe';

export interface IEagerComponentInputs extends Record<string, any> {
  prop1: string,
  prop2: number,
}

@Component({
  selector: 'eager',
  templateUrl: './eager.component.html',
  styleUrls: ['./eager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@MyInputs()
export class EagerComponent implements IData<IEagerComponentInputs>, OnInit {
  @Input() data!: IDataInputs$<IEagerComponentInputs>;

  props$: IDataInputsFull$<IEagerComponentInputs> = {
    prop1: new BehaviorSubject<string>('test'),
    prop2: new BehaviorSubject<number>(1)
  };

  ngOnInit(): void {
    this.props$.prop1.subscribe(console.log);
    this.props$.prop2.subscribe(console.log);
  }
}
