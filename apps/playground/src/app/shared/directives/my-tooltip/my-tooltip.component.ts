import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './my-tooltip.component.html',
  styleUrls: ['./my-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalloutComponent {
    public content: String = '';
}