import { Compiler, ElementRef, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createLazilyRenderedCustomElement, LazyRenderer, LazyRendererComponent } from './utils/custom-element.utils';

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
        const helloComponentLazyRenderer: LazyRenderer = (compiler: Compiler, elementRef: ElementRef, injector: Injector) => {
            import('./components/hello/hello.module')
                .then(moduleDef => compiler.compileModuleAsync(moduleDef.HelloModule))
                .then(moduleFactory => moduleFactory.create(injector).instance.renderComponent(elementRef.nativeElement));
        };

        customElements.define('hello-element', createLazilyRenderedCustomElement(helloComponentLazyRenderer, this.injector));
    }
}
