import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, map, skip, ReplaySubject, Subject, takeUntil, withLatestFrom } from 'rxjs';

@Component({
  selector: 'my-multi-selector',
  templateUrl: './my-multi-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyMultiSelectorComponent implements OnInit, OnDestroy {

  selectedItems$ = new ReplaySubject<string[]>();
  
  /**
   * Optional input property which represents currently selected items 
   * which are possible to be selected based on {@link data$}.
   */
  @Input() set selectedItems(selectedItems: string[]) {
    this.selectedItems$.next(selectedItems);
  }

  data$ = new ReplaySubject<string[]>();

  /*
   * The input data which represents the possible values which can be selected.
   */
  @Input() set data(data: string[]) {
    this.data$.next(data);
  }

  /**
   * Represents the filtered value based on the inputs {@link selectedItems} and {@link data}.
   */
  selectedItemsFiltered$ = new ReplaySubject<string[]>();

  /**
   * Event which is outputed whenever the {@link selectedItemsFiltered$} get changed.
   */
  @Output() selectedItemsChange = new EventEmitter<string[]>();

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
        const filteredSelectedItems = selectedItems.filter(selectedItem => data.some(d => d === selectedItem));
        return filteredSelectedItems;
      })
    ).subscribe(this.selectedItemsFiltered$);

    /* 
     * Whenever data$ is set we check current selectedItemsFiltered to ensure they still exist.
     */
    this.data$.pipe(
      withLatestFrom(this.selectedItemsFiltered$),
      takeUntil(this.onDestory$),
      map(([data, selectedItemsFiltered]) => {
        const filteredSelectedItems = selectedItemsFiltered.filter(selectedItemFiltered => data.some(d => d === selectedItemFiltered));
        return filteredSelectedItems;
      })
    ).subscribe(this.selectedItemsFiltered$);

    /* 
     * Emits the selectedItems but only those that are also inside data$. Will skipped the initial emit on render.
     * Will be debounced so if selectedItems$ and data$ is set at the same time it dosen't emit same values twice.
     */
    this.selectedItemsFiltered$.pipe(
      skip(1),
      debounceTime(0),
      takeUntil(this.onDestory$)
    ).subscribe(this.selectedItemsChange);
  }

  ngOnDestroy(): void {
    this.onDestory$.complete();
  }
}
