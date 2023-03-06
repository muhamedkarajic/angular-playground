


import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { Injectable } from '@angular/core';
import { interval, Subject, takeUntil } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WebWorkerService implements OnDestroy {
    constructor() {
        this.create();
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
    index = 0;

    onDestroy$ = new Subject<void>();

    create(terminateMs?: number) {
        const worker = this.createWorker((data: any) => {
            postMessage(data.data);
        });
        worker.onmessage = (e) => {
            console.log('msg', e.data);
            if(terminateMs)
                setTimeout(() => {
                    worker.terminate();
                }, terminateMs);
        };
        
        interval(1000).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            worker.postMessage(`hi ${++this.index}`);
        })
    }

    createWorker(fn: (_: any) => void) {
        const blob = new Blob(['self.onmessage = ', fn.toString()], {
            type: 'text/javascript',
        });
        const url = URL.createObjectURL(blob);

        return new Worker(url);
    }
}

@Component({
  selector: 'worker',
  template: `<h1>Dynamic Worker View.</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicWorkerComponent {
  constructor(private webWorkerService: WebWorkerService) {
    
  }
}
