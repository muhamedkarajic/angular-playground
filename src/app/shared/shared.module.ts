import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { MyCastPipe } from './pipes/my-cast.pipe';
import { MyTypeofPipe } from './pipes/my-typeof.pipe';
import { MyIfDirective } from './directives/my-if.directive';

@NgModule({
  declarations: [
    MyCastPipe,
    MyTypeofPipe,
    MyIfDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    MyCastPipe,
    MyTypeofPipe,
    MyIfDirective,
  ]
})
export class SharedModule { }
