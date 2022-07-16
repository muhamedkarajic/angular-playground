import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { take, map, ReplaySubject, Subject, takeUntil, BehaviorSubject, withLatestFrom, combineLatest, debounceTime } from 'rxjs';
import { Required_ } from '../decorators/required.decorator';
import { RequiredInputs } from '../decorators/until-destory.decorator/until-destroy';


@RequiredInputs()
@Component({
  selector: 'my-multi-selector',
  templateUrl: './my-multi-selector.component.html',
  styleUrls: ['my-multi-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyMultiSelectorComponent implements OnInit, OnDestroy {
  public isInitialOnSelectedItemsChangeSkipped$ = new BehaviorSubject<boolean>(true);

  /**
   * Optional input which will determine if the initial {@link onSelectedItemsChange} triggers.
   */
  @Input() set isInitialOnSelectedItemsChangeSkipped(skipInitial: boolean) {
    this.isInitialOnSelectedItemsChangeSkipped$.next(skipInitial);
  }

  readonly selectedItems$ = new BehaviorSubject<string[]>([]);

  readonly data$ = new ReplaySubject<string[] | undefined>();

  /**
   * Optional input property which represents currently selected items 
   * which are possible to be selected based on {@link data$}.
   */
  @Input() set selectedItems(selectedItems: string[]) {
    this.selectedItems$.next(selectedItems);
  }

  readonly dataWithDetails$ = new ReplaySubject<{ value: string, selected: boolean }[]>();

  /*
   * The input data which represents the possible values which can be selected.
   */
  @Input() @Required_() set data(data: string[] | undefined) {
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
  protected readonly onDestory$ = new Subject<void>();

  /*
   * If the current item is inside the selectedItems it will remove it and vice versa.
   */
  toggleItem(selectedItem: string) {
    this.selectedItems$.pipe(
      map(selectedItems => {
        const isSelected = selectedItems.find(s => s === selectedItem) ? true : false;
        if (isSelected)
          return selectedItems.filter(s => s !== selectedItem);
        return [...selectedItems, selectedItem];
      }),
      take(1),
      takeUntil(this.onDestory$)
    ).subscribe(selectedItems => this.selectedItems$.next(selectedItems));
  }
  
  constructor(private readonly zone: NgZone) {

  }
  ngOnInit(): void {
    
    
    /**
     * Provides the functionality to set values using inputs.
     * Will take data$ and based on it filter values which can't be set 
     * and that will be shown as the {@link selectedItemsFiltered$}.
     */
    this.selectedItems$.pipe(
      withLatestFrom(this.data$),
      map(([selectedItems, data]) => {
        const selectedItemsFiltered = selectedItems.filter(selectedItem => data!.some(d => d === selectedItem));
        return selectedItemsFiltered;
      }),
      takeUntil(this.onDestory$)
    ).subscribe(this.selectedItemsFiltered$);

    /* 
     * Whenever data$ is set we check selectedItems$ to ensure proper are set which exist.
     */
    this.data$.pipe(
      withLatestFrom(this.selectedItems$),
      map(([data, selectedItems]) => {
        const selectedItemsFiltered = selectedItems.filter(selectedItem => data!.some(d => d === selectedItem));
        return selectedItemsFiltered;
      }),
      takeUntil(this.onDestory$)
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

    combineLatest([this.data$, this.selectedItemsFiltered$]).pipe(
      map(([data, selectedItemsFiltered]) => {
        return data!.map(d => {
          return {
            value: d,
            selected: selectedItemsFiltered.some(selectedItem => selectedItem === d)
          }
        })
      }),
      takeUntil(this.onDestory$)
    ).subscribe(this.dataWithDetails$);
  }

  /*
   * Manages the destoryment of all subscriptions.
   */
  ngOnDestroy(): void {
    this.onDestory$.complete();
  }
}
