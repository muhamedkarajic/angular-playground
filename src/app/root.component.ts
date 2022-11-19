import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Loading, map$, ResultFactory, validate, validate2, validate3, validate4Async } from './shared/models/helpers/railway-programming-with-loading-obs.helper';

@Component({
  selector: 'my-root',
  templateUrl: './root.component.html'
})
export class RootComponent implements OnInit {

  constructor(private indexBDService: NgxIndexedDBService) { }

  async ngOnInit(): Promise<void> {
    const y: Loading = {
      tag: 'loading'
    };

    const x = ResultFactory.create(y);

    ResultFactory.create(y).pipe(
      map$(validate),
      map$(validate2),
      map$(validate3),
      map$(validate4Async),
    ).subscribe(x => {
      console.log(x);
    });
  }
}

