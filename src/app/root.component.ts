import { ChangeDetectionStrategy, Component, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IDynamicContentComponent } from './dynamic-content/dynamic-content.component';
import { DynamicComponent } from './dynamic/dynamic.component';
import { Dynamic_v2Component } from './dynamic_v2/dynamic_v2.component';
import { nameof } from './shared/helpers/nameof.helper';

declare var global: any;

@Component({
  selector: 'my-root',
  templateUrl: './root.component.html'
})
export class RootComponent {
  data$ = new BehaviorSubject<string>('Hello...');
  componentType$ = new BehaviorSubject<Type<IDynamicContentComponent<string>>>(DynamicComponent);
  
  constructor() {
    setTimeout(() => {
      const document = global.document as Document;
      const div = document.getElementById("myDiv");
      div!.innerHTML="<div></br>Hello World</br></br></div>"
    }, 1000);

    setTimeout(() => {
      this.data$.next('Hello... World!');
    }, 2000);

    setTimeout(() => {
      this.componentType$.next(Dynamic_v2Component);
    }, 4000);
  }

  @ViewChild('dynamicContainer', {read: ViewContainerRef}) container!: ViewContainerRef;
  
  createContainer(): void
  {
    this.container.clear();
    const dynamicComponentRef = this.container.createComponent(DynamicComponent);
    dynamicComponentRef.setInput(nameof<DynamicComponent>('data'), 'My new Text');
  }
}
