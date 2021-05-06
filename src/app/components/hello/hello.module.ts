import { ComponentFactoryResolver, Injector, NgModule, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloComponent } from './hello.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
    declarations: [
        HelloComponent
    ],
    imports: [
        CommonModule,
        ModalModule.forRoot(),
    ]
})
export class HelloModule {
    constructor(private injector: Injector, private componentFactoryResolver: ComponentFactoryResolver) {
    }

    renderComponent(containerRef?: ViewContainerRef): void {
        containerRef?.createComponent(this.componentFactoryResolver.resolveComponentFactory(HelloComponent), 0, this.injector);
    }
}
