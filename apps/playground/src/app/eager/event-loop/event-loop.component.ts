import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { animationFrameScheduler, asapScheduler, asyncScheduler, BehaviorSubject, interval, takeWhile, timer } from 'rxjs';
import { awaitLatestFrom } from '../../shared/models/helpers/rxjs/await-latest-from';

@Component({
  selector: 'event-loop',
  templateUrl: './event-loop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventLoopComponent {
  changeDetection = inject(ChangeDetectorRef);

  count$ = new BehaviorSubject<number>(0);

  animationFrameScheduler$ = new BehaviorSubject<number>(0);
  asyncScheduler$ = new BehaviorSubject<number>(0);
  asapScheduler$ = new BehaviorSubject<number>(0);
  syncScheduler$ = new BehaviorSubject<number>(0);

  incrementCount() {
    this.count$.next(this.count$.value + 1);
  }

  i = 0;

  start = Date.now();

  eventLoop() { //Ref: https://javascript.info/event-loop
    let i = 0;
    do {
      this.syncScheduler$.next(this.syncScheduler$.value + 1);
      i++;
    } while (i < 100_000);

    if (this.i == 1e9) {
      console.log("Done in " + (Date.now() - this.start) + 'ms');
    } else {
      console.log("Part in " + (Date.now() - this.start) + 'ms');
      timer(0, asyncScheduler).subscribe(() => this.eventLoop());
    }
  }

  async ngOnInit(): Promise<void> {

    this.changeDetection.detach();
    this.changeDetection.detectChanges();

    this.eventLoop();

    interval(1000, asyncScheduler).pipe(
    ).subscribe(() => {
      this.changeDetection.detectChanges();
    });

    interval(0, animationFrameScheduler).pipe(
      awaitLatestFrom([this.animationFrameScheduler$]),
    ).subscribe(([_, animationFrameScheduler]) => {
      this.animationFrameScheduler$.next(animationFrameScheduler + 1);
    });

    interval(0, asyncScheduler).pipe(
      awaitLatestFrom([this.asyncScheduler$]),
    ).subscribe(([_, asyncScheduler]) => {
      this.asyncScheduler$.next(asyncScheduler + 1);
    });

    interval(0, asapScheduler).pipe(
      awaitLatestFrom([this.asapScheduler$]),
      takeWhile(([_, asapScheduler]) => asapScheduler <= 10_000)
    ).subscribe(([_, asapScheduler]) => {
      this.asapScheduler$.next(asapScheduler + 1);
    });
  }
}
