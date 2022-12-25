import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MyInputs } from '../shared/decorators/my-inputs.decorator';
import { IData, IDataInputs$ } from '../shared/pipes/data-input.pipe';

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

  ngOnInit(): void {
    this.data.prop1.subscribe(console.log);
    this.data.prop2.subscribe(console.log);
  }
}
