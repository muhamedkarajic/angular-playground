import { CommonModule } from '@angular/common';
import { Inject, Injectable, NgModule, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CONFIG_TOKEN, DBConfig, NgxIndexedDBModule, NgxIndexedDBService } from 'ngx-indexed-db';
import { ngxIndexedDbConfig } from './ngx-indexed-db-config.config';

@Injectable()
class MyNgxIndexedDBService extends NgxIndexedDBService implements NgxIndexedDBService {
  constructor(@Inject(CONFIG_TOKEN) dbConfig: DBConfig, @Inject(PLATFORM_ID) platformId: any) {
    super(dbConfig, platformId);
  }
}

const ngxIndexedDBModule = NgxIndexedDBModule.forRoot(ngxIndexedDbConfig)

ngxIndexedDBModule.providers!.push({
  provide: NgxIndexedDBService,
  useClass: MyNgxIndexedDBService,
})




@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule, // If routes are used in the core,
    ngxIndexedDBModule
  ],
  exports: [
    // Components which will be used outisde the core module
  ],
  providers: [
    // Singelton Services for the entire app
  ]
})
export class CoreModule { }
