import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Foo, ResultFactory, Success, validate, validate2, validate3, validate4Async } from './shared/models/helpers/railway-programming-with-loading-obs.helper';

@Component({
  selector: 'my-root',
  templateUrl: './root.component.html'
})
export class RootComponent implements OnInit {

  constructor(private indexBDService: NgxIndexedDBService) {

  }

  async ngOnInit(): Promise<void> {
    // let date: Date = new Date();

    // const user$ = new BehaviorSubject(IsLoading.get<User | IsLoading, UserError>());

    // user$.pipe(
    //   switchMapLoading$(validateUsernameNotEmpty),
    //   mapLoading$(validateUsernameHasValidChars),
    //   switchMapLoading$(saveUser)
    // ).subscribe(result => {
    //   result.match({
    //     Ok: userOrLoading => userOrLoading instanceof IsLoading ? console.log('user is still loading..') : printSavedUser(userOrLoading),
    //     Err: error => printError(error),
    //   });
    //   console.log((new Date().getTime() - date.getTime()) * 0.001 + 'ms');
    // });

    // combineLatest([user$.pipe(take(1))]).subscribe(([result]) => {
    //   console.log('after combinedLatest')
    //   const user = new User('muhamedkarajic', 'Muhamed', 'Karajic');

    //   result.match({
    //     Ok: userOrLoading => userOrLoading instanceof IsLoading ? user$.next(Result.ok(user)) : undefined,
    //     Err: error => printError(error),
    //   })
    // })

    // const entityClient = new EntityClient();

    // const entityState$ = await EntityStateFactory.create('1', entityClient, this.indexBDService);

    // const entityLoadFromServerSucceeded = await lastValueFrom(entityState$.pipe(
    //   filter(entityState => entityState instanceof EntityLoadFromServerSucceeded),
    //   take(1),
    //   map(entityState => entityState as EntityLoadFromServerSucceeded)
    // ));

    // await entityLoadFromServerSucceeded.lock();

    // const service = interpret(machine).start();

    // const state$ = from(service);
    // state$.subscribe((state) => {
    //   console.log(state.value);
    // });

    // service.send('TOGGLE');
    // service.send('BREAK');

    const y: Success<number> = {
      tag: 'success',
      value: 1
    };

    ResultFactory.create(y).pipe(
      Foo.map$(validate),
      Foo.map$(validate2),
      Foo.map$(validate3),
      Foo.map$(validate4Async),
    ).subscribe(x => {
      console.log(x);
    });

  }
}

