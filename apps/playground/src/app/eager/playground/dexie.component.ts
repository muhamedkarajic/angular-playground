import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Dexie } from 'dexie';

function log(txt: string) {
  (document.getElementById('log') as any).value += txt + '\n';
}

// const myKeys = Array.from(Array(1000).keys()).map(x => `${(x+1000)}`)
// let time = performance.now();
// const data = await this.window.db.raindrops.bulkGet(myKeys);
// console.log(performance.now() - time, data);

@Component({
  selector: 'dexie',
  template: `<a href="http://dexie.org/docs/API-Reference" target="_new">Dexie API Reference (new tab)</a>

  <h3>Log</h3>
  <textarea id="log"></textarea>
  <p id="safari-version" style="display:none;">
    This browser denies indexedDB access from iframes.
    <a href="https://fiddle.jshell.net/dfahlander/xf2zrL4p/show" target="_top">Click here to open it directly without any iframe.</a>
  </p>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DexieComponent {
  drops: any[] = [];
  db = new Dexie('raindrops');

  ngOnInit() {
    (window as any)['db'] = this.db;
    this.db.version(1).stores({
      raindrops: 'id',
    });
    this.db.open();

    //
    // Define database
    //
    log('Using Dexie v' + Dexie.semVer);

    //
    // Prepare data
    //
    
    // this.testPerformance();
  }

  async testPerformance() {
    for (var i = 1; i <= 10000; ++i) {
      this.drops.push({
        id: `${i}`,
        someData: {
          someText: 'some value',
          someNumber: Math.floor(Math.random() * 11),
          ancient: [
            'write',
            [
              -1005176737.0127225,
              'river',
              'finger',
              'habit',
              1303173981,
              false,
            ],
            'properly',
            239808436,
            'river',
            'make',
          ],
          green: -185540282.1253891,
          date: 'feathers',
          record: true,
          many: -755746199.358345,
          whispered: -1905489363,
        },
      });
    }

    try {
      //
      // Open Database
      //

      let time: number;
      log(``);
      log(`bulkPut()`);
      log(`=========`);
      log(`Let's put 10,000 documents into indexedthis.db! ...`);
      await new Promise((resolve) => setTimeout(resolve, 1)); // Leave some breath to GC.
      time = performance.now();
      console.log(this.db);
      await (this.db as any).raindrops.bulkPut(this.drops);
      log(
        `Put operations done. Took ${Math.round(
          performance.now() - time
        )} milliseconds.`
      );
      log(``);
      log(`Query`);
      log(`=====`);
      log(`Now get all documents...`);
      time = performance.now();
      const fewDrops = await (this.db as any).raindrops.toArray();
      log(
        `Took ${Math.round(performance.now() - time)} milliseconds to find ${
          fewDrops.length
        } matching documents`
      );

      console.log(fewDrops);
    } catch (err) {
      switch (err && (err as any).name) {
        case 'BulkError':
          log(
            'Some documents did not succeed. However documents was added successfully (not fully)'
          );
          break;
        case 'MissingAPIError':
          log("Couldn't find indexedDB API");
          break;
        case 'SecurityError':
          (document.getElementById('log') as any).style = 'display:none';
          (document.getElementById('safari-version') as any).style = 'display:';
          break;
        default:
          log((err as any));
          break;
      }
    }
  }
}
