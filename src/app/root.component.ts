import { ChangeDetectionStrategy, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicComponent } from './dynamic/dynamic.component';

declare var global: any;

@Component({
  selector: 'my-root',
  templateUrl: './root.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent {
  constructor() {
    setTimeout(() => {
      const document = global.document as Document;
      const div = document.getElementById("myDiv");
      div!.innerHTML="<div></br>Hello World</br></br></div>"
    }, 1000);
  }

  @ViewChild('dynamicContainer', {read: ViewContainerRef}) container!: ViewContainerRef;
  
  createContainer(): void
  {
    this.container.clear();
    const dynamicComponentRef = this.container.createComponent(DynamicComponent);
    dynamicComponentRef.setInput('x', 'test');
  }
  
}
