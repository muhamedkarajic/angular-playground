import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

@Component({
  selector: 'eager',
  templateUrl: './eager.component.html',
  styleUrls: ['./eager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EagerComponent {
  changeDetection = inject(ChangeDetectorRef);

  ngOnInit(): void {

  }
}
