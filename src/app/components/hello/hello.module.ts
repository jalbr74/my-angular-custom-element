import { ComponentFactory, ComponentFactoryResolver, Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloComponent } from './hello.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';

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
    constructor(private injector: Injector, private componentFactoryResolver: ComponentFactoryResolver, private modalService: BsModalService) {
        this.addClassNameToModalContainerWhenShown('my-styles-root');
    }

    addClassNameToModalContainerWhenShown(className: string): void {
        this.modalService.onShown.subscribe(() => {
            document.querySelectorAll('.iam-modal-dialog').forEach((element: Element) => {
                element.parentElement?.classList.add(className);
            });
        });
    }

    getHelloComponentFactory(): ComponentFactory<HelloComponent> {
        return this.componentFactoryResolver.resolveComponentFactory(HelloComponent);
    }
}
