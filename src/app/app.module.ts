import { Compiler, ElementRef, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createLazilyLoadedCustomElement, LazyComponentLoader, LazyLoaderComponent } from './utils/custom-element.utils';

@NgModule({
    declarations: [
        LazyLoaderComponent
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
        const helloComponentLazyLoader: LazyComponentLoader = (compiler: Compiler, elementRef: ElementRef, injector: Injector) => {
            import('./components/hello/hello.module')
                .then(moduleDef => compiler.compileModuleAsync(moduleDef.HelloModule))
                .then(moduleFactory => moduleFactory.create(injector).instance.renderMainComponent(elementRef.nativeElement));
        };

        customElements.define('hello-element', createLazilyLoadedCustomElement(helloComponentLazyLoader, this.injector));
    }
}
