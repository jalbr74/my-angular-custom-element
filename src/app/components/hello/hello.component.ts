import { Component, ElementRef, HostBinding, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-hello',
    templateUrl: './hello.component.html',
    styleUrls: ['./hello.component.scss']
})
export class HelloComponent {
    @HostBinding('class') classes = 'my-styles-root';

    modalRef: BsModalRef;

    constructor(private modalService: BsModalService) {
    }

    showDialog(template: TemplateRef<any>): void {
        this.modalRef = this.modalService.show(template, {
            class: 'my-styles-root'
        });
    }
}
