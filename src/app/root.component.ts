import { Component } from '@angular/core';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { Object } from './shared/models/object.model';


@Component({
  selector: 'my-root',
  templateUrl: './root.component.html',
})
export class RootComponent {
  Object = Object;
  object = new Object() as any;

  readonly propertyA$ = new BehaviorSubject<string | null>('A');
  readonly propertyB$ = new ReplaySubject<string | null>(1);

  constructor() {
    setInterval(() => { (this.object as Object).id = "RANDOM_NAME_X2" }, 1000)

    setTimeout(() => {
      this.propertyB$.next('B');
    }, 3000);
  }
}
