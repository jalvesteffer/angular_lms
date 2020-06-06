import { BranchLibraryComponent } from './branch-library.component';

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

//Mock modal reference class
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve("x"));
}

describe('BranchLibraryComponent', () => {
  let component: BranchLibraryComponent;
  let fixture: ComponentFixture<BranchLibraryComponent>;
  let service: LmsService;
  let pagerService: PagerService;
  let modalService: NgbModal;
  let fb: FormBuilder;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchLibraryComponent, MockBranchsortPipe ],
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
    component = new BranchLibraryComponent(service,pagerService, fb, modalService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchLibraryComponent);
    component.searchBranchForm =  fb.group({
      searchString:  [""]
    });

    component.updateBranchForm = fb.group({
      branchId: [""],
      branchName: [""],
      branchAddress: [""],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should load components and call life cycle methods", () => {
    spyOn(component, "loadAllBranches");
    component.ngOnInit();
    expect(component.loadAllBranches).toHaveBeenCalled;
  });

  it("set page less than 1", () => {
    component.setPage(0);
    expect(component).toBeTruthy();
  });

  it("should load all branches via a mock-service - return mock data", () => {
    const mockBranches = [
      {
        branchId: 9,
        branchName: "Ash Library",
        branchAddress: "25 S. Hartford Lane West Lafayette, WA 47906"
      },
      {
          branchId: 1,
          branchName: "Blue Flower Library",
          branchAddress: "602 Water Dr.Arlington Heights, IL 60004"
      },
    ];
    spyOn(service, "getAll").and.returnValue(of(mockBranches));
    component.loadAllBranches();
    expect(service).toBeTruthy();
    expect(component.branches).toEqual(mockBranches);
    expect(component.branches.length).toEqual(2);
  });

  it("should error on null getAll value", () => {
    spyOn(service, "getAll").and.returnValue(throwError({status: 404}));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.branches).toBeUndefined();
  });

  it("should touch ngAfterViewInit()", () => {
    component.ngAfterViewInit();
    expect(service).toBeTruthy();
  });

  it("should be able to show all results if no search", fakeAsync(() => {
    const mockBranches = 
      {
          branchId: 1,
          branchName: "Blue Flower Library",
          branchAddress: "602 Water Dr.Arlington Heights, IL 60004"
      };
    spyOn(component, "loadAllBranches");
    spyOn(service, "getAll").and.returnValue(of(mockBranches));
    component.searchBranches();
    tick();
  }));

  it("should be able to search", fakeAsync(() => {
    const mockBranches = 
      {
          branchId: 1,
          branchName: "Blue Flower Library",
          branchAddress: "602 Water Dr.Arlington Heights, IL 60004"
      };
    spyOn(service, "getAll").and.returnValue(of(mockBranches));
    spyOn(component, "setPage");
    component.searchBranchForm.value.searchString = 'blue';
    component.searchBranches();
    tick();
  }));

  it("should be able to handle search error", fakeAsync(() => {
    component.searchBranchForm.value.searchString = 'blue';
    spyOn(service, "getAll").and.returnValue(throwError({status: 404}));
    spyOn(component, "setPage");
    component.searchBranches();
    tick();
  }));

  it("should open a update modal window", fakeAsync(() => {
    const mockBranches = 
      {
          branchId: 1,
          branchName: "Blue Flower Library",
          branchAddress: "602 Water Dr.Arlington Heights, IL 60004"
      };
    spyOn(service, "getAll").and.returnValue(of(mockBranches));
    spyOn(modalService, "open").and.returnValue(mockModalRef);
    spyOn(service, "updateObj").and.returnValue(of(mockBranches));
    component.open("updateBranchForm", mockBranches);
  }));

  it("should be able to update", fakeAsync(() => {
    const mockBranches = 
    {
      branchId: 1,
      branchName: "Blue Flower Library",
      branchAddress: "602 Water Dr.Arlington Heights, IL 60004"
    };
    component.updateBranchForm.value.branchId = 1;
    component.updateBranchForm.value.branchName = "Blue Flower Library";
    component.updateBranchForm.value.branchAddress = "602 Water Dr.Arlington Heights, IL 60004";
    
    spyOn(service, "updateObj").and.returnValue(of(mockBranches));
    spyOn(component, "loadAllBranches");
    component.updateBranch();
    expect(component.loadAllBranches).toHaveBeenCalled;
  }));

  it("should be able to handle update error", fakeAsync(() => {
    component.updateBranchForm.value.branchId = 1;
    component.updateBranchForm.value.branchName = "Blue Flower Library";
    component.updateBranchForm.value.branchAddress = "602 Water Dr.Arlington Heights, IL 60004";
    
    spyOn(service, "updateObj").and.returnValue(throwError({status: 404}));
    spyOn(component, "loadAllBranches");
    component.updateBranch();
    expect(component.loadAllBranches).toHaveBeenCalled;
  }));

  it("should open a update modal window that is null", fakeAsync(() => {
    const mockBranches = 
      {
          branchId: null,
          branchName: null,
          branchAddress: null
      };

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    spyOn(service, "updateObj").and.returnValue(of(mockBranches));
    component.open("updateBranchForm", null);
  }));

  it("should close a modal window", fakeAsync(() => {
    const mockBranches = 
    {
      branchId: 1,
      branchName: "Blue Flower Library",
      branchAddress: "602 Water Dr.Arlington Heights, IL 60004"
    };

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    mockModalRef.result = new Promise((resolve, reject) => reject("someerror"));
    component.open("updateBranchForm", mockBranches);
    tick();
    expect(component.closeResult).toBe("Dismissed");
  }));

});
