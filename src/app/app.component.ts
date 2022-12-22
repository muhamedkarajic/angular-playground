import { Component } from '@angular/core';
import { IDataInputs, IEagerComponentInputs } from './eager/eager.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  x: IDataInputs<IEagerComponentInputs> = {
    prop1: {
      defaultValue: 'Hello World'
    },
    prop2: {
      type: 1
    }
  }
}