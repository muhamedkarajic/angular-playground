import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { DynamicContentComponent } from './eager/dynamic-content/dynamic-content.component';
import { Dynamic_v1Component } from './eager/dynamic_v1/dynamic_v1.component';
import { Dynamic_v2Component } from './eager/dynamic_v2/dynamic_v2.component';
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
    Dynamic_v1Component,
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
