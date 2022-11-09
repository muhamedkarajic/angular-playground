import { DBConfig, ObjectStoreSchema } from "ngx-indexed-db";

export const ngxIndexedDbConfig: DBConfig = {
  name: 'DataBase',
  version: 1,
  objectStoresMeta: [{
    store: 'entities',
    storeConfig: { keyPath: 'id', autoIncrement: false },
    storeSchema: [
      { name: 'name', keypath: 'name', options: { unique: false } },
    ] as ObjectStoreSchema[]
  }]
};
