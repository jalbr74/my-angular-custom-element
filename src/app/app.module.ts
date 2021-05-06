import { Compiler, ElementRef, Injector, NgModule, ViewContainerRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createLazilyRenderedCustomElement, LazyRendererFn, LazyRendererComponent } from './utils/custom-element.utils';

@NgModule({
    declarations: [
        LazyRendererComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: []
})
export class AppModule {
    constructor(private injector: Injector) {
    }

    ngDoBootstrap(): void {
        const helloComponentLazyRenderer: LazyRendererFn = (compiler: Compiler, injector: Injector, containerRef: ViewContainerRef) => {
            import('./components/hello/hello.module')
                .then(moduleDef => compiler.compileModuleAsync(moduleDef.HelloModule))
                .then(moduleFactory => moduleFactory.create(injector).instance.renderComponent(containerRef));
        };

        customElements.define('hello-element', createLazilyRenderedCustomElement(helloComponentLazyRenderer, this.injector));
    }
}
