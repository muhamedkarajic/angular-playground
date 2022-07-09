import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { map, of, ReplaySubject, Subject, take, takeUntil, withLatestFrom } from 'rxjs';

@Component({
  selector: 'my-multi-selector',
  templateUrl: './my-multi-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyMultiSelectorComponent implements OnDestroy {
  data$ = new ReplaySubject<string[]>();
  selectedItems$ = new ReplaySubject<string[]>();
  onDestory$ = new Subject<void>();

  @Input() set data(data: string[]) {
    this.data$.next(data);

    of(undefined).pipe( // If I subscribe to data$ then it ends up with a additional subscription. 
      withLatestFrom(this.selectedItems$),
      map(([_, selectedItems]) => {
        return selectedItems;
      }),
      take(1),
      takeUntil(this.onDestory$)
    ).subscribe(selectedItems => this.selectedItems = selectedItems);
  }

  @Input() set selectedItems(selectedItems: string[]) {
    // Triggers the setting of the selectedItems$ but will filter it based on data$.
    of(undefined).pipe( // Don't know why but directly calling this.data$.subscribe results in wrong data.
      withLatestFrom(this.data$),
      map(([_, data]) => data),
      take(1),
      takeUntil(this.onDestory$)
    ).subscribe(data => {
      const filteredSelectedItems = selectedItems.filter(selectedItem => data.some(d => d === selectedItem));
      this.selectedItems$.next(filteredSelectedItems);
    });
  }

  @Output() selectedItemsChange = new EventEmitter<string[]>();

  constructor() {
    this.selectedItems$.subscribe(this.selectedItemsChange);
  }

  ngOnDestroy(): void {
    this.onDestory$.complete();
  }
}
