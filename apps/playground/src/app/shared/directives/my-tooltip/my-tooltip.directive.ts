import {
    ComponentRef, Directive,
    ElementRef, inject, Input,
    OnDestroy,
    ViewContainerRef
} from '@angular/core';

import { CalloutComponent } from './my-tooltip.component';

class Point {
    constructor(public x: number, public y: number) { };
}

@Directive({
    selector: '[myCallout]',
    host: {
        '(mouseenter)': 'showCallout()',
        '(mouseleave)': 'hideCallout()'
    }
})
export class CalloutDirective implements OnDestroy {
    private elementRef = inject(ElementRef);
    private viewContainer = inject(ViewContainerRef);
    @Input() myCallout: String = '';
    private calloutRef: ComponentRef<CalloutComponent> | null = null;

    showCallout() {
        this.calloutRef = this.createCallout(this.myCallout);
        const calloutEl = this.calloutRef.location.nativeElement;
        const targetPos = this.getTargetCalloutLocation();
        calloutEl.style.left = targetPos.x + 'px';
        calloutEl.style.top = targetPos.y + 'px';
    }

    hideCallout() {
        if (this.calloutRef) {
            this.calloutRef.destroy();
        }
    }

    private createCallout(content: String): ComponentRef<CalloutComponent> {
        this.viewContainer.clear();

        const calloutComponentRef = this.viewContainer.createComponent(CalloutComponent);

        calloutComponentRef.instance.content = content;

        return calloutComponentRef;
    }

    private getTargetCalloutLocation(): Point {
        let box = this.elementRef.nativeElement.getBoundingClientRect();
        return new Point(box.left + box.width / 2, box.bottom + 5);
    }

    ngOnDestroy() {
        this.hideCallout();
    }
}
