import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, map, ReplaySubject, Subject, takeUntil, withLatestFrom, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'my-multi-selector',
  templateUrl: './my-multi-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyMultiSelectorComponent implements OnInit, OnDestroy {

  readonly isInitialOnSelectedItemsChangeSkipped$ = new BehaviorSubject<boolean>(true);

  /**
   * Optional input which will determine if the initial {@link onSelectedItemsChange} triggers.
   */
  @Input() set isInitialOnSelectedItemsChangeSkipped(skipInitial: boolean) {
    this.isInitialOnSelectedItemsChangeSkipped$.next(skipInitial);
  }

  readonly selectedItems$ = new ReplaySubject<string[]>();

  /**
   * Optional input property which represents currently selected items 
   * which are possible to be selected based on {@link data$}.
   */
  @Input() set selectedItems(selectedItems: string[]) {
    this.selectedItems$.next(selectedItems);
  }

  readonly data$ = new ReplaySubject<string[]>();

  /*
   * The input data which represents the possible values which can be selected.
   */
  @Input() set data(data: string[]) {
    this.data$.next(data);
  }

  /**
   * Represents the filtered value based on the inputs {@link selectedItems} and {@link data}.
   */
   readonly selectedItemsFiltered$ = new ReplaySubject<string[]>();

  /**
   * Event which is outputed whenever the {@link selectedItemsFiltered$} get changed.
   */
  @Output() onSelectedItemsChange = new EventEmitter<string[]>();

  /*
   * The destory life cicle subject which will be completed if the component gets destoryed.
   */
  onDestory$ = new Subject<void>();

  ngOnInit(): void {
    /**
     * Provides the functionality to set values using inputs.
     * Will take data$ and based on it filter values which can't be set 
     * and that will be shown as the {@link selectedItemsFiltered$}.
     */
    this.selectedItems$.pipe(
      withLatestFrom(this.data$),
      takeUntil(this.onDestory$),
      map(([selectedItems, data]) => {
        const selectedItemsFiltered = selectedItems.filter(selectedItem => data.some(d => d === selectedItem));
        return selectedItemsFiltered;
      })
    ).subscribe(this.selectedItemsFiltered$);

    /* 
     * Whenever data$ is set we check selectedItems$ to ensure proper are set which exist.
     */
    this.data$.pipe(
      withLatestFrom(this.selectedItems$),
      takeUntil(this.onDestory$),
      map(([data, selectedItems]) => {
        const selectedItemsFiltered = selectedItems.filter(selectedItem => data.some(d => d === selectedItem));
        return selectedItemsFiltered;
      })
    ).subscribe(this.selectedItemsFiltered$);

    /* 
     * Emits the selectedItems but only those that are also inside data$. Will skipped the initial emit on render.
     * Will be debounced so if selectedItems$ and data$ is set at the same time it dosen't emit same values twice.
     */
    this.selectedItemsFiltered$.pipe(
      withLatestFrom(this.isInitialOnSelectedItemsChangeSkipped$),
      debounceTime(0),
      takeUntil(this.onDestory$),
    ).subscribe(([selectedItemsFiltered, skipInitial]) => {
      skipInitial ? this.isInitialOnSelectedItemsChangeSkipped$.next(false) : this.onSelectedItemsChange.next(selectedItemsFiltered);
    });
  }

  /*
   * Manages the destoryment of all subscriptions.
   */
  ngOnDestroy(): void {
    this.onDestory$.complete();
  }
}
