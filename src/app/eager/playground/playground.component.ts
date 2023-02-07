import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { SimpleInputs } from 'src/app/shared/decorators/simple-inputs.decorator';

@Component({
  selector: 'playground',
  template: `<div>Playground2 {{input$ | async}}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
@SimpleInputs()
export class PlaygroundComponent {
  changeDetection = inject(ChangeDetectorRef);

  @Input() input = 'default prop';
  input$!: Subject<string>;

  ngOnInit(): void {
    this.input$.subscribe(console.log);
  }
}
