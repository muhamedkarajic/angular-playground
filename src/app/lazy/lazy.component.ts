import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lazy',
  styleUrls: ['./lazy.component.scss'],
  templateUrl: './lazy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyComponent { }
