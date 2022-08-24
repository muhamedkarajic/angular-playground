import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { DynamicComponent } from './dynamic/dynamic.component';
import { EagerComponent } from './eager/eager.component';
import { EagerModule } from './eager/eager.module';


import { RootComponent } from './root.component';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
  {
    path: 'lazy-module',
    loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule)
  },
  {
    path: 'eager-module',
    component: EagerComponent
  }
];

@NgModule({
  declarations: [
    RootComponent,
    DynamicComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    SharedModule,
    EagerModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class RootModule { }
