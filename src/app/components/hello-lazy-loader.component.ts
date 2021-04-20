import { Compiler, Component, ElementRef, Injector, OnInit } from '@angular/core';

@Component({
    selector: 'app-hello',
    template: ''
})
export class HelloLazyLoaderComponent implements OnInit {
    constructor(private compiler: Compiler, private injector: Injector, private elementRef: ElementRef) {
    }

    ngOnInit(): void {
        // Lazily loads the module, and then renders its main component:
        import('./hello/hello.module')
            .then(m => this.compiler.compileModuleAsync(m.HelloModule))
            .then(moduleFactory => moduleFactory.create(this.injector).instance.renderMainComponent(this.elementRef.nativeElement));
    }
}
