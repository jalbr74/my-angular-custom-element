import { Compiler, Component, ElementRef, Inject, InjectionToken, Injector } from '@angular/core';
import { createCustomElement, NgElementConstructor } from '@angular/elements';

export type LazyComponentLoader = (compiler: Compiler, elementRef: ElementRef, injector: Injector) => void;
export const LAZY_COMPONENT_LOADER = new InjectionToken<LazyComponentLoader>('LazyComponentLoader');

@Component({
    selector: 'app-lazy-loader',
    template: ''
})
export class LazyLoaderComponent {
    constructor(
        @Inject(LAZY_COMPONENT_LOADER) lazyComponentLoader: LazyComponentLoader,
        private compiler: Compiler,
        private elementRef: ElementRef,
        private injector: Injector
    ) {
        lazyComponentLoader(compiler, elementRef, injector);
    }
}

/**
 * Creates a custom element based on the LazyLoaderComponent, which
 */
export function createLazilyLoadedCustomElement<P>(lazyLoader: LazyComponentLoader, injector: Injector): NgElementConstructor<P> {
    return createCustomElement(LazyLoaderComponent, {
        injector: Injector.create({
            providers: [{ provide: LAZY_COMPONENT_LOADER, useValue: lazyLoader }],
            parent: injector
        })
    });
}
