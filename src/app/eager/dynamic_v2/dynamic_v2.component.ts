import { Component, Input } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { IDynamicContentComponent } from '../dynamic-content/dynamic-content.component';

@Component({
  selector: 'dynamic_v2',
  templateUrl: './dynamic_v2.component.html',
})
export class Dynamic_v2Component implements IDynamicContentComponent<string> {
  readonly text$ = new ReplaySubject<string>(1);

  @Input() set data(data: string) {
    this.text$.next(data);
  }
}
