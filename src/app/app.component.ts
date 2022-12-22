import { Component } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  number$ = new ReplaySubject<number>(1);

  constructor() {
    setTimeout(() => {
      this.number$.next(1000);
    }, 2_000);
  }

}