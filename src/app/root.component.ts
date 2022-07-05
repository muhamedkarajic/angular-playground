import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Object } from './shared/models/object.model';


@Component({
  selector: 'my-root',
  templateUrl: './root.component.html',
})
export class RootComponent {
  Object = Object;
  object = new Object() as any;

  myArray = ['test', null];

  constructor(private router: Router) {
    setInterval(() => { (this.object as Object).id = "RANDOM_NAME_X2" }, 1000)

    setTimeout(() => {
      this.myArray.pop();
      this.myArray.push('another test');
    }, 3000);
  }
}
