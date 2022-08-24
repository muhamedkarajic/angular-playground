import { Component, Input } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'dynamic_v2',
  templateUrl: './dynamic_v2.component.html',
})
export class Dynamic_v2Component {
  
  readonly text$ = new ReplaySubject<string>(1);
  
  @Input() set data(data: string)
  {
    console.log('set data', data);
    this.text$.next(data);
  }
}
