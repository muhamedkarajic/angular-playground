import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { SimpleInputs } from '../shared/decorators/simple-inputs.decorator';

@Component({
  selector: 'eager',
  templateUrl: './eager.component.html',
  styleUrls: ['./eager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@SimpleInputs()
export class EagerComponent implements OnInit {
  @Input() test1: string = "Hello2 World"; // is not required cause has default input
  test1$!: ReplaySubject<string>;

  @Input() set test2(test2: number) {
    if (!test2) { // will proceed
      return;
    }
    this.test2$.next(test2);// will be set from parent
  }
  test2$!: ReplaySubject<number>;


  @Input() test3!: number; // no one sets it will result in error
  test3$!: ReplaySubject<number>;

  ngOnInit(): void {
    this.test1$.subscribe(console.log);
  }
}
