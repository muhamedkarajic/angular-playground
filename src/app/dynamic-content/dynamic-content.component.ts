import { ChangeDetectorRef, Component, ComponentRef, Input, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, ReplaySubject, switchMap, take, map } from 'rxjs';

import { nameof } from '../shared/helpers/nameof.helper';

export interface IDynamicContentComponent {
  set data(data: unknown);
}

@UntilDestroy()
@Component({
  selector: 'dynamic-content',
  templateUrl: './dynamic-content.component.html',
})
export class DynamicContentComponent implements IDynamicContentComponent {

  readonly componentType$ = new ReplaySubject<Type<IDynamicContentComponent>>(1);
  @Input() set component(component: Type<IDynamicContentComponent>) {
    this.componentType$.next(component);
  }

  readonly data$ = new ReplaySubject<unknown>(1);
  @Input() set data(data: unknown) {
    this.data$.next(data);
  }

  readonly dynamicContainerRef$ = new ReplaySubject<ViewContainerRef>(1);
  @ViewChild('dynamicContainer', { read: ViewContainerRef }) set dynamicContainerRef(dynamicContainerRef: ViewContainerRef) {
    if (!dynamicContainerRef)
      return;
    this.dynamicContainerRef$.next(dynamicContainerRef);
  }

  readonly componentRef$ = new ReplaySubject<ComponentRef<unknown>>(1);

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.componentType$.pipe(
      switchMap(componentType => this.dynamicContainerRef$.pipe(
        take(1),
        map(dynamicContainerRef => ({ dynamicContainerRef, componentType }))
      )),
      untilDestroyed(this)
    ).subscribe(({ componentType, dynamicContainerRef }) => {

      dynamicContainerRef.clear();

      const componentRef = dynamicContainerRef.createComponent(componentType);
      this.componentRef$.next(componentRef);

      this.changeDetectorRef.detectChanges();
    });

    combineLatest([this.data$, this.componentRef$]).pipe(
      untilDestroyed(this)
    ).subscribe(([data, componentRef]) => {
      componentRef.setInput(nameof<IDynamicContentComponent>('data'), data);
    });
  }
}
