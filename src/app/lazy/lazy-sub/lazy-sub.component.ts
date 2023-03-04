import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lazy-sub',
  templateUrl: './lazy-sub.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazySubComponent { }
