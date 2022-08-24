import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, combineLatestWith, map, of, ReplaySubject, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { Object } from '../shared/models/object.model';
import { MyMultiSelectorComponent } from '../shared/my-multi-selector/my-multi-selector.component';

@Component({
  selector: 'eager',
  templateUrl: './eager.component.html',
  styleUrls: ['./eager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EagerComponent {
  Object = Object;
  object = new Object() as any;

  myPromise$ = new Promise<string>((resolve) => resolve('string'));
  myObject$ = new ReplaySubject<Object>(1);
  readonly myData$ = new BehaviorSubject<string[]>(['data1', 'data2', 'data3', 'data4']);
  readonly selectedItems$ = new BehaviorSubject<string[]>(['data1', 'data2', 'data3']);
  myMultiSelectorComponent$ = new ReplaySubject<MyMultiSelectorComponent>(1);

  @ViewChild('blockThree')
  set myMultiSelectorComponent(v: MyMultiSelectorComponent | undefined) {
    if(!v)
      return;
    this.myMultiSelectorComponent$.next(v);
  }

  onSelectedChange(selectedItems: string[]) {
    console.log('onSelectedItemsChange', JSON.parse(JSON.stringify(selectedItems)));
  }

  readonly propertyA$ = new BehaviorSubject<string | null>('A');
  readonly propertyB$ = new ReplaySubject<string[] | null>(1);

  constructor(ref: ChangeDetectorRef) {
    // this.propertyA$.pipe(
    //   tap(console.log),
    //   switchMap(x => combineLatest([this.propertyB$]).pipe(map(y => [x, y]), take(1))),
    // ).subscribe(console.log);
    
    // setTimeout(() => {
    //   this.propertyB$.next(['B1']);
    // }, 2000);
    // setTimeout(() => {
    //   this.propertyB$.next(['B2']);
    // }, 3000);
    // setTimeout(() => {
    //   this.propertyA$.next('A2');
    // }, 4000);

    // this.propertyA$.pipe(switchMap(propertyA => {
    //   return this.propertyB$.pipe(
    //     take(1), 
    //     map(propertyB => ([propertyA, propertyB] as [string, string[]]))
    //   )
    // })).subscribe(x => console.log('propertyA & propertyB (combineLatestFrom): ', x));

    // this.propertyA$.pipe(
    //   withLatestFrom(this.propertyB$)
    // ).subscribe(x => console.log('propertyA & propertyB (withLatestFrom): ', x));

    // setTimeout(() => {
    //   this.myObject$.next({ id: 'myId', name: 'myName' });
    // }, 1000);

    // setTimeout(() => {
    //   this.propertyB$.next('B');
    //   this.selectedItems$.next(['data1', 'data3'])
    //   this.x$.next('test');
    // }, 2000);

    // setTimeout(() => {
    //   this.myObject$ = new ReplaySubject(1);
    //   this.myObject$.next({ id: 'myNewId', name: 'myNewName' });
    // }, 3000);

    // setTimeout(() => {
    //   this.propertyB$.next('B');
    //   this.myData$.next(['data1', 'data2'])
    // }, 6000);

    // setTimeout(() => {
    //   this.selectedItems$.next(['data3'])
    // }, 7000);

    // setTimeout(() => {
    //   this.myData$.next(['data1', 'data2', 'data3'])
    //   this.selectedItems$.next(['data1', 'data2', 'data3'])
    // }, 9000);
  }
}
