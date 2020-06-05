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
import { of, throwError } from 'rxjs';

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
    component.searchBookCopiesForm =  fb.group({
      searchString:  [""]
    });

    component.updateBookCopiesForm = fb.group({
      noOfCopies: [""],
      bookId: [""],
      branchId: [""]
    });

    component.addBookCopiesForm = fb.group({
      bookId: [""],
      branchName: [""],
      branchId: [""],
      title: [""],
      noOfCopies: [""]
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should load components and call life cycle methods", () => {
    spyOn(component, "loadAllCopies");
    component.ngOnInit();
    //tests
    expect(component.loadAllCopies).toHaveBeenCalled;
  });

  it("set page less than 1", () => {
    component.setPage(0);
    expect(component).toBeTruthy();
  });

  it("should be able to select", () => {
    const mockBook = 
      {
        bookId: 1,
        title: "Panic at the Costco",
        branchId: 10,
        branchName: "Freedom Library",
        noOfCopies: 9
      };
    spyOn(service, "getAll").and.returnValue(of(mockBook));
    component.onBranchSelect(1);
    expect(component).toBeTruthy();
  });

  it("should be able to handle select error 404", () => {
    spyOn(service, "getAll").and.returnValue(throwError({status: 404}));
    component.onBranchSelect(1);
    expect(component).toBeTruthy();
  });


  it("should load all branches via a mock-service - return mock data", () => {
    const mockBookCopies = [
      {
        bookId: 11,
        title: "My First Book",
        branchId: 4,
        branchName: "Knight Library",
        noOfCopies: 12
    },
    {
        bookId: 15,
        title: "Panic at the Costco",
        branchId: 10,
        branchName: "Freedom Library",
        noOfCopies: 9
    }
    ];
    spyOn(service, "getAll").and.returnValue(of(mockBookCopies));
    component.loadAllCopies();
    expect(service).toBeTruthy();
    expect(component.bookCopies).toEqual(mockBookCopies);
    expect(component.bookCopies.length).toEqual(2);
  });

  it("should error on null getAll value", () => {
    spyOn(service, "getAll").and.returnValue(throwError({status: 404}));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.bookCopies).toBeUndefined();
  });

  it("should error on null getAll value", () => {
    spyOn(service, "getAll").and.returnValue(throwError({status: 404}));
    component.loadAllBranches();
    expect(service).toBeTruthy();
    expect(component.bookCopies).toBeUndefined();
  });

  it("should error on null getAll value", () => {
    spyOn(service, "getAll").and.returnValue(throwError({status: 404}));
    component.loadAllBooks();
    expect(service).toBeTruthy();
    expect(component.bookCopies).toBeUndefined();
  });

  it("should touch ngAfterViewInit()", () => {
    component.ngAfterViewInit();
    expect(service).toBeTruthy();
  });

  it("should be able to show all results if no search", fakeAsync(() => {
    const mockBook = 
      {
        bookId: 15,
        title: "Panic at the Costco",
        branchId: 10,
        branchName: "Freedom Library",
        noOfCopies: 9
      };
    spyOn(component, "loadAllCopies");
    spyOn(service, "getAll").and.returnValue(of(mockBook));
    component.searchBookCopies();
    tick();
  }));

  it("should be able to search", fakeAsync(() => {
    const mockBook = 
      {
        bookId: 15,
        title: "Panic at the Costco",
        branchId: 10,
        branchName: "Freedom Library",
        noOfCopies: 9
      };
    spyOn(service, "getAll").and.returnValue(of(mockBook));
    spyOn(component, "setPage");
    component.searchBookCopiesForm.value.searchString = 'blue';
    component.searchBookCopies();
    tick();
  }));

  it("should be able to handle search error", fakeAsync(() => {
    spyOn(service, "getAll").and.returnValue(throwError({status: 404}));
    spyOn(component, "setPage");
    component.searchBookCopiesForm.value.searchString = 'blue';
    component.searchBookCopies();
    tick();
  }));

  it("should open a update modal window", fakeAsync(() => {
    const mockBook = 
      {
        bookId: 15,
        title: "Panic at the Costco",
        branchId: 10,
        branchName: "Freedom Library",
        noOfCopies: 9
      };

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    spyOn(service, "updateObj").and.returnValue(of(mockBook));
    component.open("updateBookCopiesForm", mockBook);
  }));

  it("should be able to add new book copy", fakeAsync(() => {
    const mockBook = 
      {
        bookId: 15,
        title: "Panic at the Costco",
        branchId: 10,
        branchName: "Freedom Library",
        noOfCopies: 9
      };
    component.addBookCopiesForm.value.branchId = 15;
    component.addBookCopiesForm.value.title = "Panic at the Costco";
    component.addBookCopiesForm.value.branchId = 10;
    component.addBookCopiesForm.value.branchName = "Freedom Library";
    component.addBookCopiesForm.value.noOfCopies = 9;

    spyOn(service, "postObj").and.returnValue(of(mockBook));
    spyOn(component, "loadAllCopies");
    component.addBookCopies();
    expect(component.loadAllCopies).toHaveBeenCalled;
  }));

  it("should be able to handle add new book copy error", fakeAsync(() => {
    component.addBookCopiesForm.value.branchId = 15;
    component.addBookCopiesForm.value.title = "Panic at the Costco";
    component.addBookCopiesForm.value.branchId = 10;
    component.addBookCopiesForm.value.branchName = "Freedom Library";
    component.addBookCopiesForm.value.noOfCopies = 9;

    spyOn(service, "postObj").and.returnValue(throwError({status: 404}));
    spyOn(component, "loadAllCopies");
    component.addBookCopies();
    expect(component.loadAllCopies).toHaveBeenCalled;
  }));

  it("should be able to update new book copy", fakeAsync(() => {
    const mockBook = 
      {
        bookId: 15,
        branchId: 10,
        noOfCopies: 9
      };
    component.updateBookCopiesForm.value.branchId = 15;
    component.updateBookCopiesForm.value.branchId = 10;
    component.updateBookCopiesForm.value.noOfCopies = 9;

    spyOn(service, "updateObj").and.returnValue(of(mockBook));
    spyOn(component, "loadAllCopies");
    component.updateBookCopies();
    expect(component.loadAllCopies).toHaveBeenCalled;
  }));

  it("should be able to handle update new book copy error", fakeAsync(() => {
    component.updateBookCopiesForm.value.branchId = 15;
    component.updateBookCopiesForm.value.branchId = 10;
    component.updateBookCopiesForm.value.noOfCopies = 9;

    spyOn(service, "updateObj").and.returnValue(throwError({status: 404}));
    spyOn(component, "loadAllCopies");
    component.updateBookCopies();
    expect(component.loadAllCopies).toHaveBeenCalled;
  }));

  it("should open a add modal window", fakeAsync(() => {
    const mockBook = 
      {
        bookId: 15,
        title: "Panic at the Costco",
        branchId: 10,
        branchName: "Freedom Library",
        noOfCopies: 9
      };

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    spyOn(service, "postObj").and.returnValue(of(mockBook));
    component.open("addBookCopiesForm", mockBook);
  }));

  it("should open a update modal window that is null", fakeAsync(() => {
    const mockBook = 
      {
        bookId: 15,
        title: "Panic at the Costco",
        branchId: 10,
        branchName: "Freedom Library",
        noOfCopies: 9
      };

      spyOn(modalService, "open").and.returnValue(mockModalRef);
      spyOn(service, "updateObj").and.returnValue(of(null));
      component.open("updateBookCopiesForm", null);
  }));

  it("should open a add modal window that is null", fakeAsync(() => {
    const mockBook = 
      {
        bookId: 15,
        title: "Panic at the Costco",
        branchId: 10,
        branchName: "Freedom Library",
        noOfCopies: 9
      };

      spyOn(modalService, "open").and.returnValue(mockModalRef);
      spyOn(service, "postObj").and.returnValue(of(null));
      component.open("addBookCopiesForm", null);
  }));

  it("should close a modal window", fakeAsync(() => {
    const mockBook = 
      {
        bookId: 15,
        title: "Panic at the Costco",
        branchId: 10,
        branchName: "Freedom Library",
        noOfCopies: 9
      };

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    mockModalRef.result = new Promise((resolve, reject) => reject("someerror"));
    component.open("updateBookCopiesForm", mockBook);
    tick();
    expect(component.closeResult).toBe("Dismissed");
  }));
});
