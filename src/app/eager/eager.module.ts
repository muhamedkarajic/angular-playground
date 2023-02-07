import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { EagerComponent } from './eager.component';
import { EventLoopComponent } from './event-loop/event-loop.component';
import { PlaygroundComponent } from './playground/playground.component';

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
    PlaygroundComponent
  ],
  exports: [
    EagerComponent,
    EventLoopComponent,
    PlaygroundComponent
  ]
})
export class EagerModule { }
