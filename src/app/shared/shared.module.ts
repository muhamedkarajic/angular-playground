import { AsyncPipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CalloutComponent } from './directives/my-tooltip/my-tooltip.component';
import { CalloutDirective } from './directives/my-tooltip/my-tooltip.directive';
import { MyMultiSelectorComponent } from './my-multi-selector/my-multi-selector.component';
import { MyCastPipe } from './pipes/my-cast.pipe';
import { AwaitPipe } from './pipes/await.pipe';
import { MyArePropsDefinedPipe } from './pipes/my-defined-props.pipe';
import { MyTypeofPipe } from './pipes/my-typeof.pipe';
import { MyTestComponentComponent } from './my-test-component/my-test-component.component';
import { MyMapComponent } from './my-map/my-map.component';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [
    MyCastPipe,
    MyTypeofPipe,
    TruncatePipe,
    AwaitPipe,

    MyArePropsDefinedPipe,
    CalloutComponent,
    MyTestComponentComponent,
    MyMultiSelectorComponent,
    MyMapComponent,
    CalloutDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    MyCastPipe,
    TruncatePipe,
    AwaitPipe,
    MyArePropsDefinedPipe,
    CalloutComponent,
    MyMapComponent,
    MyTestComponentComponent,
    MyMultiSelectorComponent,
    CalloutDirective,
  ],
  entryComponents: [
    CalloutComponent
  ],
  providers: [AsyncPipe]
})
export class SharedModule { }
