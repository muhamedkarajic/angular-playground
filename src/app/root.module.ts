import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from './core/core.module';
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
    path: '',
    component: EagerComponent
  }
];

@NgModule({
  declarations: [
    RootComponent
  ],
  
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    CoreModule,
    SharedModule,
    EagerModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class RootModule { }
