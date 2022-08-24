import { Component, Input } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'dynamic',
  templateUrl: './dynamic.component.html',
})
export class DynamicComponent { 
  readonly text$ = new ReplaySubject<string>(1);
  
  @Input() set text(text: string)
  {
    this.text$.next(text);
  }

}
