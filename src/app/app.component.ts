import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  value$ = new ReplaySubject<string>(1);
  number$ = new ReplaySubject<number>(1);

  constructor() {
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