import { AfterViewInit, Compiler, Component, Injector, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
    selector: 'app-lazy-loader-for-hello',
    template: '<ng-container #containerRef></ng-container>'
})
export class LazyLoaderForHelloComponent implements AfterViewInit {
    @ViewChild('containerRef', { read: ViewContainerRef }) containerRef?: ViewContainerRef;

    constructor(private compiler: Compiler, private injector: Injector) {
    }

    async ngAfterViewInit(): Promise<void> {
        // Note: we don't specify the types for the module and component we want to load here, otherwise they'll get imported at the top
        // of this file, which will cause them to be added to the main chunk, and subvert the benefits of using a lazy loader component.
        const moduleDef = await import('../components/hello/hello.module');
        const moduleFactory = await this.compiler.compileModuleAsync(moduleDef.HelloModule);
        const componentFactory = moduleFactory.create(this.injector).instance.getHelloComponentFactory();

        // Replaces the <ng-container> tag with the component we dynamically-loaded:
        this.containerRef.createComponent(componentFactory, 0, this.injector);
    }
}
