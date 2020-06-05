import { BorrowerAdminComponent } from './borrower-admin.component';
import { LmsService } from '../../common/services/lms.service';
import { PagerService } from '../../common/services/pager.service';
import { Observable, from, of, observable, throwError } from "rxjs";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators, NgModel } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from "@angular/forms";
import { Pipe, PipeTransform } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync
} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { resolve } from 'url';

@Pipe({
  name: 'borrowerSort'
})
export class MockBorrowersortPipe implements PipeTransform {
  transform(input: any[]): any { }
}

//Mock modal reference class
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve("x"));
}

describe('BorrowerAdminComponent', () => {
  let component: BorrowerAdminComponent;
  let fixture: ComponentFixture<BorrowerAdminComponent>;
  let service: LmsService;
  let pagerService: PagerService;
  let modalService: NgbModal;
  let fb: FormBuilder;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BorrowerAdminComponent, MockBorrowersortPipe],
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
    component = new BorrowerAdminComponent(service, pagerService, modalService, fb);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerAdminComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should load components and call life cycle methods", () => {
    spyOn(component, "loadAllBorrowers");
    component.ngOnInit();

    expect(component.loadAllBorrowers).toHaveBeenCalled;
  });

  it("should load all borrowers via a mock-service - return mock data", () => {
    const mockBorrowers = [
      {
        "cardNo": 7,
        "name": "Bill Brown",
        "address": "Williamsburg, VA",
        "phone": "757-458-8788"
      },
      {
        "cardNo": 5,
        "name": "Bob Evans",
        "address": "Charlottesville, VA",
        "phone": "703-727-5223"
      }
    ];

    spyOn(service, "getAll").and.returnValue(of(mockBorrowers));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.borrowers).toEqual(mockBorrowers);
    expect(component.borrowers.length).toEqual(2)
  });

  it("should error on null getAll value", () => {
    spyOn(service, "getAll").and.returnValue(throwError({ status: 404 }));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.borrowers).toBeUndefined();
  });

  it("should ignore setpage out-of-bounds", () => {
    let retVal = component.setPage(0);
    expect(retVal).toEqual(1);
  });

  it("should open a modal window", fakeAsync(() => {
    const mockBorrower = {
      "cardNo": 7,
      "name": "Bill Brown",
      "address": "Williamsburg, VA",
      "phone": "757-458-8788"
    };

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    component.open("editBorrowerModal", mockBorrower);
    expect(service).toBeTruthy();
  }));

  it("should open a modal window for create", fakeAsync(() => {
    spyOn(modalService, "open").and.returnValue(mockModalRef);
    component.open("editBorrowerModal", null);
    expect(service).toBeTruthy();
  }));

  it("should close a modal window", fakeAsync(() => {
    const mockBorrower = {
      "cardNo": 7,
      "name": "Bill Brown",
      "address": "Williamsburg, VA",
      "phone": "757-458-8788"
    };

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    mockModalRef.result = new Promise((resolve, reject) => reject("error"));
    component.open("editBorrowerModal", mockBorrower);
    tick();
    expect(component.closeResult).toBe("Dismissed");
  }));
});
