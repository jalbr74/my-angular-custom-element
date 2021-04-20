import { Component, ElementRef, HostBinding, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-hello',
    templateUrl: './hello.component.html',
    styleUrls: ['./hello.component.scss']
})
export class HelloComponent implements OnInit {
    @HostBinding('class') classes = 'my-styles-root';

    modalRef: BsModalRef;

    constructor(private modalService: BsModalService, private elementRef: ElementRef) {
    }

    ngOnInit(): void {
        console.log('The message passed in from a tag attribute is: ' + this.elementRef.nativeElement.getAttribute('message'));
    }

    showDialog(template: TemplateRef<any>): void {
        this.modalRef = this.modalService.show(template, );
    }
}
