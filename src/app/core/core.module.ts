import { CommonModule } from '@angular/common';
import { Inject, Injectable, NgModule, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CONFIG_TOKEN, DBConfig, NgxIndexedDBModule, NgxIndexedDBService, ObjectStoreMeta, ObjectStoreSchema } from 'ngx-indexed-db';
import { map, Observable, of, ReplaySubject, take } from 'rxjs';
import { ngxIndexedDbConfig } from './ngx-indexed-db-config.config';


export function CreateObjectStore(
  indexedDB: IDBFactory,
  dbName: string,
  version: number,
  storeSchemas: ObjectStoreMeta[],
  migrationFactory?: () => { [key: number]: (db: IDBDatabase, transaction: IDBTransaction) => void }
): Observable<boolean> {
  if (!indexedDB) {
    return of(false);
  }

  const request: IDBOpenDBRequest = indexedDB.open(dbName, version);
  const onupgradeneeded$ = new ReplaySubject<void>(1);
  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    const database: IDBDatabase = (event.target as any).result;

    storeSchemas.forEach((storeSchema: ObjectStoreMeta) => {
      if (!database.objectStoreNames.contains(storeSchema.store)) {
        const objectStore = database.createObjectStore(storeSchema.store, storeSchema.storeConfig);
        storeSchema.storeSchema.forEach((schema: ObjectStoreSchema) => {
          objectStore.createIndex(schema.name, schema.keypath, schema.options);
        });
      }
    });

    const storeMigrations = migrationFactory && migrationFactory();
    if (storeMigrations) {
      Object.keys(storeMigrations)
        .map((k) => parseInt(k, 10))
        .filter((v) => v > event.oldVersion)
        .sort((a, b) => a - b)
        .forEach((v) => {
          storeMigrations[v](database, request.transaction!);
        });
    }

    database.close();
    onupgradeneeded$.next();
  };

  onupgradeneeded$.subscribe(y => console.log('upgrade', y));

  return onupgradeneeded$.pipe(take(1)).pipe(map(() => true));
}


@Injectable()
export class MyNgxIndexedDBService extends NgxIndexedDBService implements NgxIndexedDBService {
  _indexedDB: IDBFactory = this['indexedDB']!;
  _dbConfig: DBConfig = this['dbConfig']!;

  constructor(@Inject(CONFIG_TOKEN) dbConfig: DBConfig, @Inject(PLATFORM_ID) platformId: unknown) {
    super(dbConfig, platformId);
  }

  isStoreExisting(storeName: string): Observable<boolean> {
    const result$ = new ReplaySubject<boolean>();

    const openDatabase = this._indexedDB.open(this._dbConfig.name);

    openDatabase.onsuccess = () => {
      const database = openDatabase.result;

      const isDataStoreExisting = database.objectStoreNames.contains(storeName);

      result$.next(isDataStoreExisting);
    }

    openDatabase.onerror = () => {
      result$.next(false);
    }

    return result$.asObservable().pipe(take(1));
  }

  override createObjectStore(
    storeSchema: ObjectStoreMeta,
    migrationFactory?: () => { [key: number]: (db: IDBDatabase, transaction: IDBTransaction) => void }
  ): Observable<boolean> {
    const storeSchemas: ObjectStoreMeta[] = [storeSchema];
    return CreateObjectStore(this._indexedDB, this._dbConfig.name, ++this._dbConfig.version, storeSchemas, migrationFactory);
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
