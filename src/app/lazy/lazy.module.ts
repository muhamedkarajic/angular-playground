import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EagerModule } from '../eager/eager.module';
import { SharedModule } from '../shared/shared.module';
import { LazySubComponent } from './lazy-sub/lazy-sub.component';
import { LazyComponent } from './lazy.component';

const routes: Routes = [{
  path: '',
  component: LazyComponent,
  outlet: 'test',
  children: [
    {
      path: 'lazy-component',
      component: LazySubComponent
    }
  ]
}];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    EagerModule
  ],
  declarations: [
    LazyComponent,
    LazySubComponent
  ]
})
export class LazyModule { }
