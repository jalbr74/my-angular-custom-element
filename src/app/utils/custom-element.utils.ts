import {
    AfterViewInit,
    Compiler,
    Component,
    ElementRef,
    Inject,
    InjectionToken,
    Injector,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { createCustomElement, NgElementConstructor } from '@angular/elements';

export type LazyRendererFn = (compiler: Compiler, injector: Injector, containerRef: ViewContainerRef) => void;

const LAZY_RENDERER_FUNCTION = new InjectionToken<LazyRendererFn>('LazyRendererFn');

@Component({
    selector: 'app-lazy-renderer',
    template: '<ng-container #containerRef></ng-container>'
})
export class LazyRendererComponent implements AfterViewInit {
    @ViewChild('containerRef', { read: ViewContainerRef }) containerRef?: ViewContainerRef;

    constructor(
        private compiler: Compiler,
        private injector: Injector,
        @Inject(LAZY_RENDERER_FUNCTION) private renderComponent: LazyRendererFn
    ) {
    }

    ngAfterViewInit(): void {
        this.renderComponent(this.compiler, this.injector, this.containerRef);
    }
}

/**
 * Creates a custom element based on the LazyRendererComponent.
 */
export function createLazilyRenderedCustomElement<P>(lazyRendererFn: LazyRendererFn, injector: Injector): NgElementConstructor<P> {
    return createCustomElement(LazyRendererComponent, {
        injector: Injector.create({
            providers: [{ provide: LAZY_RENDERER_FUNCTION, useValue: lazyRendererFn }],
            parent: injector
        })
    });
}
