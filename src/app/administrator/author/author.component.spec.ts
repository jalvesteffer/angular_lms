import { AuthorComponent } from './author.component';
import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { PagerService } from "../../common/services/pager.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { Pipe, PipeTransform } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

@Pipe({
  name: 'authorSort'
})
export class MockAuthorSortPipe implements PipeTransform {
  transform(input: any[]): any {}
}

//Mock modal reference class
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve("x"));
}

describe('AuthorComponent', () => {
  let component: AuthorComponent;
  let fixture: ComponentFixture<AuthorComponent>;
  let service: LmsService;
  let pagerService: PagerService;
  let modalService: NgbModal;
  let fb: FormBuilder;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorComponent, MockAuthorSortPipe ],
      imports: [
        NgbModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgMultiSelectDropDownModule,
        HttpClientTestingModule,
      ],
      providers: [LmsService, PagerService],
    }).compileComponents();
    service = new LmsService(null);
    pagerService = new PagerService();
    fb = new FormBuilder();
    modalService = TestBed.get(NgbModal);
    component = new AuthorComponent(service,pagerService, modalService, fb);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
