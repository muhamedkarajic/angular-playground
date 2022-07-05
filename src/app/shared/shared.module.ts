import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { MyCastPipe } from './pipes/my-cast.pipe';
import { MyTypeofPipe } from './pipes/my-typeof.pipe';

@NgModule({
  declarations: [
    MyCastPipe,
    MyTypeofPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    MyCastPipe,
    MyTypeofPipe,
  ]
})
export class SharedModule { }
