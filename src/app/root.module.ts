import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { DynamicContentComponent } from './dynamic-content/dynamic-content.component';
import { DynamicComponent } from './dynamic/dynamic.component';
import { Dynamic_v2Component } from './dynamic_v2/dynamic_v2.component';
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
    Dynamic_v2Component,
    DynamicContentComponent
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
