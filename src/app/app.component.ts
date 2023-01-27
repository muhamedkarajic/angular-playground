import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interpret } from 'xstate';
import { machine } from './machine';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  service = interpret(machine).onTransition(state => {
    state.matches('toggledOff');
    // state.hasTag('');
    console.log(state.context);
  })

  constructor() {
    this.service.start();
  }
}