import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  input = new BehaviorSubject<string>('new input');

  ngOnInit(): void {
    // const x = new EntityClient();

    // ResultFactory.create({
    //   tag: 'success',
    //   value: 1
    // } as Success<number>).pipe(
    //   map$(validate),
    //   map$(validate2),
    // ).subscribe(console.log)
  }
}