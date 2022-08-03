import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RequiredInputs } from '../decorators/required-inputs.decorator';

@RequiredInputs()
@Component({
  selector: 'my-test-component',
  templateUrl: './my-test-component.component.html',
  styleUrls: ['my-test-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTestComponentComponent {
  
}
