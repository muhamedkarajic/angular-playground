import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, of, ReplaySubject, take } from 'rxjs';
import { Object } from './shared/models/object.model';

@Component({
  selector: 'my-root',
  templateUrl: './root.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent {
  Object = Object;
  object = new Object() as any;

  readonly myData$ = new BehaviorSubject<string[]>(['data1', 'data2', 'data3']);
  readonly selectedItems$ = new BehaviorSubject<string[]>(['data1', 'data2', 'data3']);
  onSelectedChange(selectedItems: string[]) {
    console.log('onSelectedItemsChange', JSON.parse(JSON.stringify(selectedItems)));
  }
  readonly propertyA$ = new BehaviorSubject<string | null>('A');
  readonly propertyB$ = new ReplaySubject<string | null>(1);
  readonly x$ = new BehaviorSubject<string | null>(null);

  globalIndex = 0;

  constructor() {

    const someObservbale$ = of(undefined);
    const index = this.globalIndex;
    this.globalIndex++;
    someObservbale$.pipe(
      take(1)// Dont forget to unsubscribe - so take 1.
    ).subscribe(() => {
      console.log('index is: ', index);
    });


    // setInterval(() => { (this.object as Object).id = "RANDOM_NAME_X2" }, 1000)
    
    setTimeout(() => {
      this.propertyB$.next('B');
      this.selectedItems$.next(['data1', 'data3'])
      this.x$.next('test');
    }, 3000);

    setTimeout(() => {
      this.propertyB$.next('B');
      this.myData$.next(['data1', 'data2'])
    }, 6000);

    setTimeout(() => {
      this.selectedItems$.next(['data3'])
    }, 7000);

    setTimeout(() => {
      this.myData$.next(['data1', 'data2', 'data3'])
      this.selectedItems$.next(['data1', 'data2', 'data3'])
    }, 9000);
  }
}
