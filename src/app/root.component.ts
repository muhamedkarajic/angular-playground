import { ChangeDetectionStrategy, Component } from '@angular/core';

declare var global: any;

@Component({
  selector: 'my-root',
  templateUrl: './root.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent {
  constructor(){
    setTimeout(() => {
      const document = global.document as Document;
      const div = document.getElementById("myDiv");
      div!.innerHTML="<div></br>Hello World</br></br></div>"
    }, 1000);
  }
}
