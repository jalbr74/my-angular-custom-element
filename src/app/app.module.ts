import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HelloLazyLoaderComponent } from './components/hello-lazy-loader.component';
import { createCustomElement } from '@angular/elements';

@NgModule({
    declarations: [
        HelloLazyLoaderComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: []
})
export class AppModule {
    constructor(private injector: Injector) {
    }

    ngDoBootstrap(): void {
        customElements.define('hello-element', createCustomElement(HelloLazyLoaderComponent, { injector: this.injector }));
    }
}
