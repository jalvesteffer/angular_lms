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
    component.searchForm = fb.group({
      searchString: [""]
    })

    component.updateBorrowerForm = fb.group({
      cardNo: [""],
      name: [""],
      address: [""],
      phone: [""]
    });
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

  it("should be able to show all results if no search", fakeAsync(() => {
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
    spyOn(component, "loadAllBorrowers");
    spyOn(service, "getAll").and.returnValue(of(mockBorrowers));
    expect(service).toBeTruthy();
    component.search();
    tick();
  }));

  it("should be able to search", fakeAsync(() => {
    const mockBorrowers = [
      {
        "cardNo": 5,
        "name": "Bob Evans",
        "address": "Charlottesville, VA",
        "phone": "703-727-5223"
      }
    ];

    component.searchForm.value.searchString = 'Evans';
    spyOn(service, "getAll").and.returnValue(of(mockBorrowers));
    spyOn(component, "setPage");
    expect(service).toBeTruthy();
    component.search();
    tick();
    expect(mockBorrowers.length).toEqual(1);
  }));

  it("should return an error on search exception", fakeAsync(() => {
    component.searchForm.value.searchString = 'king';
    spyOn(service, "getAll").and.returnValue(throwError({ status: 404 }));
    expect(service).toBeTruthy();
    component.search();
    tick();
    expect(component.searchString).toEqual("");
  }));

  it("should be able to update", fakeAsync(() => {
    const mockBorrowers = [
      {
        "cardNo": 5,
        "name": "Bob Evans",
        "address": "Fairfax, VA",
        "phone": "703-727-5223"
      }
    ];

    component.updateBorrowerForm.value.cardNo = 5;
    component.updateBorrowerForm.value.name = "Bob Evans";
    component.updateBorrowerForm.value.address = "Charlottesville, VA";
    component.updateBorrowerForm.value.phone = "703-727-5223";

    spyOn(service, "updateObj").and.returnValue(of(mockBorrowers));
    spyOn(component, "loadAllBorrowers");
    component.updateBorrower();
    expect(component.loadAllBorrowers).toHaveBeenCalled();
  }));

  it("should be able to create", fakeAsync(() => {
    const mockBorrowers = [
      {
        "cardNo": 2,
        "name": "Bob Evans",
        "address": "Fairfax, VA",
        "phone": "703-727-5223"
      }
    ];

    component.updateBorrowerForm.value.cardNo = null;
    component.updateBorrowerForm.value.name = "Bob Evans";
    component.updateBorrowerForm.value.address = "Charlottesville, VA";
    component.updateBorrowerForm.value.phone = "703-727-5223";

    spyOn(service, "postObj").and.returnValue(of(mockBorrowers));
    spyOn(component, "loadAllBorrowers");
    component.updateBorrower();
    expect(component.loadAllBorrowers).toHaveBeenCalled();
  }));
});
