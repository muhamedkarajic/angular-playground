import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { EagerComponent } from './eager.component';
import { EventLoopComponent } from './event-loop/event-loop.component';
import { DynamicWorkerComponent } from './playground/worker.component';

const routes: Routes = [
  {
    path: 'eager-module',
    component: EagerComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    EagerComponent,
    EventLoopComponent,
    DynamicWorkerComponent,
  ],
  exports: [
    EagerComponent,
    EventLoopComponent,
    DynamicWorkerComponent
  ]
})
export class EagerModule { }
