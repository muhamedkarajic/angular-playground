import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { IEagerComponentInputs } from './eager/eager.component';
import { IDataInputs$ } from './shared/pipes/data-input.pipe';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  value$ = new ReplaySubject<string>(1);
  number$ = new ReplaySubject<number>(1);

  type1!: IDataInputs$<IEagerComponentInputs>;
  type2!: IDataInputs$<{ prop1: string; prop2: number; }>;

  constructor() {

    this.type1 = this.type2;

    setTimeout(() => {
      this.number$.next(1000);
    }, 2_000);



    setTimeout(() => {
      this.value$.next('Hallo...');
    }, 3_000);


    setTimeout(() => {
      this.value$.next('Hallo Welt...');
    }, 4_000);
  }
}