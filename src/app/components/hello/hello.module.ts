import { Injector, NgModule, ɵrenderComponent as renderComponent } from '@angular/core';
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
    constructor(private injector: Injector) {
    }

    renderMainComponent(element: HTMLElement): void {
        renderComponent(HelloComponent, { host: element, injector: this.injector });
    }
}
