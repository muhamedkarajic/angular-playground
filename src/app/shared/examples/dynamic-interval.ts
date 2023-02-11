import { BehaviorSubject, interval, switchMap } from "rxjs";

export function dynamicIntervalExample() {
    const interval$ = new BehaviorSubject(1_000); //you can set initial value as per your need

    interval$.pipe(
        switchMap(val => interval(val))
    ).subscribe(console.log);

    setTimeout(() => {
        interval$.next(0_500);
    }, 5_000);
}