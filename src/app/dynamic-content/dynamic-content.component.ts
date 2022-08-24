import { ChangeDetectorRef, Component, ComponentRef, Input, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { combineLatest, ReplaySubject, switchMap, skip, take, map } from 'rxjs';
import { nameof } from '../shared/helpers/nameof.helper';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'dynamic-content',
  templateUrl: './dynamic-content.component.html',
})
export class DynamicContentComponent {

  readonly component$ = new ReplaySubject<Type<unknown>>(1);
  @Input() set component(component: Type<unknown>) {
    this.component$.next(component);
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
    private changeDetectionRef : ChangeDetectorRef
  ) {
    this.component$.pipe(
      switchMap(component => combineLatest([this.dynamicContainerRef$, this.data$]).pipe(
        take(1),
        map(([dynamicContainerRef, data]) => ({ dynamicContainerRef, component, data }))
      )),
      untilDestroyed(this)
    ).subscribe(({ component, dynamicContainerRef, data }) => {
      console.log('component$ sub');

      dynamicContainerRef.clear();

      const componentRef = dynamicContainerRef.createComponent(component);
      componentRef.setInput(nameof<DynamicContentComponent>('data'), data);
      this.componentRef$.next(componentRef);

      this.changeDetectionRef.detectChanges();
    });

    combineLatest([this.data$, this.componentRef$]).pipe(
      skip(1),
      untilDestroyed(this)
    ).subscribe(([data, componentRef]) => {
      console.log('data$&componentRef sub');
      componentRef.setInput(nameof<DynamicContentComponent>('data'), data);
    });
  }
}
