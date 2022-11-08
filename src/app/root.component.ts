import { Component, OnInit } from '@angular/core';
import { entityCodeExample } from './shared/models/entity.model';

@Component({
  selector: 'my-root',
  templateUrl: './root.component.html'
})
export class RootComponent implements OnInit {
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

    await entityCodeExample();
  }
}
