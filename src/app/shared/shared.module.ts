import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalloutComponent } from './directives/my-tooltip/my-tooltip.component';
import { CalloutDirective } from './directives/my-tooltip/my-tooltip.directive';


import { MyCastPipe } from './pipes/my-cast.pipe';
import { MyDefinedPropsPipe } from './pipes/my-defined-props.pipe';
import { MyTypeofPipe } from './pipes/my-typeof.pipe';

@NgModule({
  declarations: [
    MyCastPipe,
    MyTypeofPipe,
    MyDefinedPropsPipe,
    CalloutComponent,
    CalloutDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    MyCastPipe,
    MyTypeofPipe,
    MyDefinedPropsPipe,
    CalloutComponent,
    CalloutDirective,
  ],
  entryComponents: [
    CalloutComponent
  ],
})
export class SharedModule { }
