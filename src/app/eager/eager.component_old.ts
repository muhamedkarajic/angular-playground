import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MyInputs } from '../shared/decorators/my-inputs.decorator';
import { MyRequiredInputs } from '../shared/decorators/my-required-inputs.decorator';
import { IDataInputsFull$, IDataOptionalInputs$, IOptionalData } from '../shared/pipes/optional-data-input.pipe';
import { IRequiredData, IRequiredDataInputs$ } from '../shared/pipes/required-data-input.pipe';

export interface IEagerComponentInputs1 extends Record<string, any> {
  prop1: string,
  prop2: number,
}

export interface IEagerComponentInputs2 extends Record<string, any> {
  prop1: string,
  prop2: number,
}

@Component({
  selector: 'eager',
  templateUrl: './eager.component.html',
  styleUrls: ['./eager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@MyRequiredInputs()
@MyInputs()
export class EagerComponent implements IOptionalData<IEagerComponentInputs1>, IRequiredData<IEagerComponentInputs1>, OnInit {
  @Input() requiredData!: IRequiredDataInputs$<IEagerComponentInputs2>;
  @Input() optionalData!: IDataOptionalInputs$<IEagerComponentInputs1>;

  optionalProps$: IDataInputsFull$<IEagerComponentInputs1> = {
    prop1: new BehaviorSubject<string>('test'),
    prop2: new BehaviorSubject<number>(1)
  };

  ngOnInit(): void {
    this.optionalProps$.prop1.subscribe(console.log);
    this.optionalProps$.prop2.subscribe(console.log);

    this.requiredData.prop1.subscribe(console.log);
    this.requiredData.prop2.subscribe(console.log);
  }
}
