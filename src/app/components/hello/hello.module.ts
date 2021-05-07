import { ComponentFactory, ComponentFactoryResolver, Injector, NgModule } from '@angular/core';
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

    getHelloComponentFactory(): ComponentFactory<HelloComponent> {
        return this.componentFactoryResolver.resolveComponentFactory(HelloComponent);
    }
}
