import { TestBed } from "@angular/core/testing";
import { CoreModule } from "src/app/core/core.module";

const MAX_TIMEOUT = 2147483647;

describe("EntityFactory tests", function () {
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [CoreModule] });
    });

    // it("and so is a spec", async function () {
    //     const indexDBService = TestBed.inject(NgxIndexedDBService);
    //     const id = '1';
    //     const entityApiHub: string = 'https://jsonplaceholder.typicode.com/todos';
    //     const entityState$ = await EntityStateFactory.create(id, entityApiHub, indexDBService);

    //     //TO DO: find out good way to test those things.
    //     expect(true).toBe(true);
    // });

    it("test performance", async function () {
        var t0 = performance.now();
        let result = 0;
        for (var i = Math.pow(12, 7); i >= 0; i--) {
            result += Math.atan(i) * Math.tan(i);
        };
        var t1 = performance.now();
        console.warn("Call to doSomething took " + (t1 - t0) + " milliseconds.")
    });
});
