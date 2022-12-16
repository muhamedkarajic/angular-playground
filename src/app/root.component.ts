import { Component, inject, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { MyNgxIndexedDBService } from './core/core.module';

@Component({
  selector: 'my-root',
  templateUrl: './root.component.html'
})
export class RootComponent implements OnInit {
  private ngxIndexedDBService = inject(NgxIndexedDBService) as MyNgxIndexedDBService;

  async ngOnInit(): Promise<void> {
    // of(undefined).subscribe(async () => {
    //   const storeName = 'entities2';

    //   const x = await lastValueFrom(this.ngxIndexedDBService.isStoreExisting(storeName));

    //   if (!x) {
    //     await lastValueFrom(this.ngxIndexedDBService.createObjectStore({
    //       store: storeName,
    //       storeConfig: { keyPath: 'id', autoIncrement: false },
    //       storeSchema: []
    //     }));

    //     await lastValueFrom(this.ngxIndexedDBService.update(storeName, { id: '1', name: 'hello world', version: 'random' }).pipe(take(1), catchError(x => {
    //       console.error(x);
    //       return of(x);
    //     })))
    //   }
    // })

    // var db_object, object_store;
    // if (!x.contains(currentobjectstore)) {
    //   db_object = i_db.createObjectStore(currentobjectstore, { autoIncrement: true });
    //   object_store = db.transaction(currentobjectstore, 'readwrite').objectStore(currentobjectstore);
    // } else {
    //   object_store = db.transaction(currentobjectstore, 'readwrite').objectStore(currentobjectstore);
    // }


    // console.log(x);
    // console.log('ngxIndexedDBService', databases);

    // const y: Success<number> = {
    //   tag: 'success',
    //   value: 1
    // };

    // ResultFactory.create(y).pipe(
    //   map$(validate),
    //   map$(validate2),
    //   map$(validate3),
    //   map$(validate4Async),
    // ).subscribe(x => {
    //   console.log(x);
    // });
  }
}

