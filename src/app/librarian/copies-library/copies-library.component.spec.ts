//import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopiesLibraryComponent } from './copies-library.component';
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
  name: 'branchSort'
})
export class MockBranchsortPipe implements PipeTransform {
  transform(input: any[]): any {}
}

@Pipe({
  name: 'titleSort'
})
export class MockBookCopiesSortPipe implements PipeTransform {
  transform(input: any[]): any {}
}

//Mock modal reference class
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve("x"));
}

describe('CopiesLibraryComponent', () => {
  let component: CopiesLibraryComponent;
  let fixture: ComponentFixture<CopiesLibraryComponent>;
  let service: LmsService;
  let pagerService: PagerService;
  let modalService: NgbModal;
  let fb: FormBuilder;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopiesLibraryComponent, MockBookCopiesSortPipe, MockBranchsortPipe],
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
    component = new CopiesLibraryComponent(service,pagerService, fb, modalService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopiesLibraryComponent);
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
