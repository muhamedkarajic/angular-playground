import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { EagerComponent } from './eager.component';

const routes: Routes = [
  {
    path: 'eager-component',
    component: EagerComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    EagerComponent
  ],
  exports: [
    EagerComponent
  ]
})
export class EagerModule { }
