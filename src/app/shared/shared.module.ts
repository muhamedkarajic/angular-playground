import { AsyncPipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CalloutComponent } from './directives/my-tooltip/my-tooltip.component';
import { CalloutDirective } from './directives/my-tooltip/my-tooltip.directive';
import { AwaitPipe } from './pipes/await.pipe';
import { InputPipe } from './pipes/data-input.pipe';
import { MyCastPipe } from './pipes/my-cast.pipe';
import { MyArePropsDefinedPipe } from './pipes/my-defined-props.pipe';
import { MyTypeofPipe } from './pipes/my-typeof.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
    declarations: [
        MyCastPipe,
        MyTypeofPipe,
        TruncatePipe,
        AwaitPipe,
        MyArePropsDefinedPipe,
        InputPipe,
        CalloutComponent,
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
        InputPipe,
        CalloutComponent,
        CalloutDirective,
    ],
    providers: [AsyncPipe]
})
export class SharedModule { }
