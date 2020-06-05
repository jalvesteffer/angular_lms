import { LoanComponent } from './loan.component';
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

//Mock modal reference class
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve("x"));
}

describe('LoanComponent', () => {
  let component: LoanComponent;
  let fixture: ComponentFixture<LoanComponent>;
  let service: LmsService;
  let pagerService: PagerService;
  let modalService: NgbModal;
  let fb: FormBuilder;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoanComponent],
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
    component = new LoanComponent(service, pagerService, modalService, fb);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should load components and call life cycle methods", () => {
    spyOn(component, "loadAllOverdueLoans");
    component.ngOnInit();

    expect(component.loadAllOverdueLoans).toHaveBeenCalled;
  });

  it("should load all branches via a mock-service - return mock data", () => {
    const mockLoans = [
      {
        "loanId": 2,
        "bookId": 2,
        "branchId": 2,
        "cardNo": 2,
        "dateOut": "2020-05-17T04:28:29.000Z",
        "dueDate": "2020-05-24T04:28:29.000Z",
        "dateIn": null,
        "book": [
          {
            "bookId": 2,
            "title": "The Shining",
            "pubId": 1
          }
        ],
        "branch": [
          {
            "branchId": 2,
            "branchName": "Pohick Regional Library",
            "branchAddress": "Burke, VA"
          }
        ],
        "borrower": [
          {
            "cardNo": 2,
            "name": "John Davis",
            "address": "Fairfax, VA",
            "phone": "545-555-5555"
          }
        ]
      },
      {
        "loanId": 3,
        "bookId": 99,
        "branchId": 9,
        "cardNo": 5,
        "dateOut": "2020-05-22T04:28:29.000Z",
        "dueDate": "2020-05-29T04:28:29.000Z",
        "dateIn": null,
        "book": [
          {
            "bookId": 99,
            "title": "A Brief History of Time",
            "pubId": 2
          }
        ],
        "branch": [
          {
            "branchId": 9,
            "branchName": "City of Fairfax Regional Library",
            "branchAddress": "Fairfax, VA"
          }
        ],
        "borrower": [
          {
            "cardNo": 5,
            "name": "Bob Evans",
            "address": "Charlottesville, VA",
            "phone": "703-727-5223"
          }
        ]
      }
    ];

    spyOn(service, "getAll").and.returnValue(of(mockLoans));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.loans).toEqual(mockLoans);
    expect(component.loans.length).toEqual(2)
  });

  it("should error on null getAll value", () => {
    spyOn(service, "getAll").and.returnValue(throwError({ status: 404 }));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.loans).toBeUndefined();
  });

  it("should ignore setpage out-of-bounds", () => {
    let retVal = component.setPage(0);
    expect(retVal).toEqual(1);
  });
});
