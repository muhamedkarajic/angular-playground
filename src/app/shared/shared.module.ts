import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalloutComponent } from './directives/my-tooltip/my-tooltip.component';
import { CalloutDirective } from './directives/my-tooltip/my-tooltip.directive';
import { MyMultiSelectorComponent } from './my-multi-selector/my-multi-selector.component';


import { MyCastPipe } from './pipes/my-cast.pipe';
import { MyDefinedPropsPipe } from './pipes/my-defined-props.pipe';
import { MyTypeofPipe } from './pipes/my-typeof.pipe';

@NgModule({
  declarations: [
    MyCastPipe,
    MyTypeofPipe,
    MyDefinedPropsPipe,
    CalloutComponent,
    MyMultiSelectorComponent,
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
    MyMultiSelectorComponent,
    CalloutDirective,
  ],
  entryComponents: [
    CalloutComponent
  ],
})
export class SharedModule { }
