import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LazyLoaderForHelloComponent } from './lazy-loaders/lazy-loader-for-hello.component';
import { createCustomElement } from '@angular/elements';

@NgModule({
    declarations: [
        LazyLoaderForHelloComponent
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
        customElements.define('hello-element', createCustomElement(LazyLoaderForHelloComponent, { injector: this.injector }));
    }
}
