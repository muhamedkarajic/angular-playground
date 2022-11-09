import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { ngxIndexedDbConfig } from './ngx-indexed-db-config.config';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule, // If routes are used in the core,
    NgxIndexedDBModule.forRoot(ngxIndexedDbConfig)
  ],
  exports: [
    // Components which will be used outisde the core module
  ],
  providers: [
    // Singelton Services for the entire app
  ]
})
export class CoreModule { }
