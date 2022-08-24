import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { RequiredInputs } from '../decorators/required-inputs.decorator';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@RequiredInputs()
@UntilDestroy()
@Component({
  selector: 'my-map',
  templateUrl: './my-map.component.html',
  styleUrls: ['my-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyMapComponent {
  readonly myObs$ = new BehaviorSubject<void>(undefined);
  readonly onDestory$ = new Subject<void>();

  constructor() {
    this.myObs$.pipe(untilDestroyed(this))
      .subscribe(x => console.info('Called.', x), () => { }, () => console.info('Completed...'));
  }
}
