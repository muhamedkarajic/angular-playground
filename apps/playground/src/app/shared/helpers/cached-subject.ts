import { ReplaySubject } from "rxjs";

export class CachedSubject<T> extends ReplaySubject<T | undefined> {

    private originalNextRef: (value: T | undefined) => void;

    cachedValue?: T;

    constructor(bufferSize?: number, windowTime?: number) {
        super(bufferSize, windowTime);
        this.originalNextRef = super.next;
        this.next = this.overrideNext;
    }


    private overrideNext(value: T): void {
        if (this.cachedValue === value)
            return;

        console.log('triggered.');
        this.cachedValue = value;

        super.next(value);
    };
}

const replaySubject = new ReplaySubject<number>(1);
replaySubject.subscribe(console.log);
replaySubject.next(100002)
replaySubject.next(100002)

const cachedSubject = new CachedSubject<number>(1);
cachedSubject.subscribe(console.log);
cachedSubject.next(100002)
cachedSubject.next(100002)
