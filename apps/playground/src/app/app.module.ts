import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { EagerModule } from './eager/eager.module';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
  {
    path: 'lazy-module',
    loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule)
  },
];

@NgModule({
  declarations: [
    AppComponent
  ],

  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    CoreModule,
    SharedModule,
    EagerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
