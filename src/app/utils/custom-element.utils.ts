import { Compiler, Component, ElementRef, Inject, InjectionToken, Injector } from '@angular/core';
import { createCustomElement, NgElementConstructor } from '@angular/elements';

export type LazyRenderer = (compiler: Compiler, elementRef: ElementRef, injector: Injector) => void;

const LAZY_COMPONENT_RENDERER = new InjectionToken<LazyRenderer>('LazyComponentRenderer');

@Component({
    selector: 'app-lazy-renderer',
    template: ''
})
export class LazyRendererComponent {
    constructor(
        @Inject(LAZY_COMPONENT_RENDERER) renderLazyComponent: LazyRenderer,
        private compiler: Compiler,
        private elementRef: ElementRef,
        private injector: Injector
    ) {
        renderLazyComponent(compiler, elementRef, injector);
    }
}

/**
 * Creates a custom element based on the LazyRendererComponent.
 */
export function createLazilyRenderedCustomElement<P>(lazyRenderer: LazyRenderer, injector: Injector): NgElementConstructor<P> {
    return createCustomElement(LazyRendererComponent, {
        injector: Injector.create({
            providers: [{ provide: LAZY_COMPONENT_RENDERER, useValue: lazyRenderer }],
            parent: injector
        })
    });
}
