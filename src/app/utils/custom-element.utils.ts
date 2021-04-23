import { Compiler, Component, ElementRef, Inject, InjectionToken, Injector } from '@angular/core';
import { createCustomElement, NgElementConstructor } from '@angular/elements';

export type LazyRendererFn = (compiler: Compiler, elementRef: ElementRef, injector: Injector) => void;

const LAZY_RENDERER_FUNCTION = new InjectionToken<LazyRendererFn>('LazyRendererFn');

@Component({
    selector: 'app-lazy-renderer',
    template: ''
})
export class LazyRendererComponent {
    constructor(
        @Inject(LAZY_RENDERER_FUNCTION) renderComponent: LazyRendererFn,
        private compiler: Compiler,
        private elementRef: ElementRef,
        private injector: Injector
    ) {
        renderComponent(compiler, elementRef, injector);
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
