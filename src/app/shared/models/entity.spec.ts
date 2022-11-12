import { TestBed } from "@angular/core/testing";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { CoreModule } from "src/app/core/core.module";
import { EntityStateFactory } from "./entity/entity-state-factory";

describe("EntityFactory tests", function () {
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [CoreModule] });
    });

    it("and so is a spec", async function () {
        const indexDBService = TestBed.inject(NgxIndexedDBService);
        const id = '1';
        const entityApiHub: string = 'https://jsonplaceholder.typicode.com/todos';
        const entityState$ = await EntityStateFactory.create(id, entityApiHub, indexDBService);
        
        //TO DO: find out good way to test those things.
        expect(true).toBe(true);
    });
});
