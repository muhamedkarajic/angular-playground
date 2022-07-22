import { AsyncPipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CalloutComponent } from './directives/my-tooltip/my-tooltip.component';
import { CalloutDirective } from './directives/my-tooltip/my-tooltip.directive';
import { MyMultiSelectorComponent } from './my-multi-selector/my-multi-selector.component';
import { MyCastPipe } from './pipes/my-cast.pipe';
import { AwaitPipe } from './pipes/await.pipe';
import { MyArePropsDefinedPipe } from './pipes/my-defined-props.pipe';
import { MyTypeofPipe } from './pipes/my-typeof.pipe';

@NgModule({
  declarations: [
    MyCastPipe,
    MyTypeofPipe,
    
    AwaitPipe,
    MyArePropsDefinedPipe,
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
    AwaitPipe,
    MyArePropsDefinedPipe,
    CalloutComponent,
    MyMultiSelectorComponent,
    CalloutDirective,
  ],
  entryComponents: [
    CalloutComponent
  ],
  providers: [AsyncPipe]
})
export class SharedModule { }
