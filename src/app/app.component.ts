import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { example } from './shared/helpers/monads/optional.helper';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  input = new BehaviorSubject<string>('new input');

  ngOnInit(): void {
    example();
  }
}