import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule // If routes are used in the core
  ],
  exports: [
    // Components which will be used outisde the core module
  ],
  providers: [
    // Singelton Services for the entire app
  ]
})
export class CoreModule { }
