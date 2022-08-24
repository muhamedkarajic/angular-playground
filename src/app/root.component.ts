import { Component, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IDynamicContentComponent } from './eager/dynamic-content/dynamic-content.component';
import { Dynamic_v1Component } from './eager/dynamic_v1/dynamic_v1.component';
import { Dynamic_v2Component } from './eager/dynamic_v2/dynamic_v2.component';
import { nameof } from './shared/helpers/nameof.helper';

declare var global: any;

@Component({
  selector: 'my-root',
  templateUrl: './root.component.html'
})
export class RootComponent {
  data$ = new BehaviorSubject<string>('Hello...');
  componentType$ = new BehaviorSubject<Type<IDynamicContentComponent<string>>>(Dynamic_v1Component);
  
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
    const dynamicComponentRef = this.container.createComponent(Dynamic_v1Component);
    dynamicComponentRef.setInput(nameof<Dynamic_v1Component>('data'), 'My new Text');
  }
}
