import { BranchComponent } from './branch.component';
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
  name: 'branchSort'
})
export class MockBranchsortPipe implements PipeTransform {
  transform(input: any[]): any { }
}

//Mock modal reference class
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve("x"));
}

describe('BranchComponent', () => {
  let component: BranchComponent;
  let fixture: ComponentFixture<BranchComponent>;
  let service: LmsService;
  let pagerService: PagerService;
  let modalService: NgbModal;
  let fb: FormBuilder;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BranchComponent, MockBranchsortPipe],
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
    component = new BranchComponent(service, pagerService, modalService, fb);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchComponent);
    component.searchForm = fb.group({
      searchString: [""]
    })

    component.updateBranchForm = fb.group({
      branchId: [""],
      branchName: [""],
      branchAddress: [""]
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

  it("should load all branches via a mock-service - return mock data", () => {
    const mockBranches = [
      {
        "branchId": 3,
        "branchName": "Arlington Public Library",
        "branchAddress": "Arlington, VA"
      },
      {
        "branchId": 10,
        "branchName": "Ashburn Library",
        "branchAddress": "Ashburn, VA"
      }
    ];

    spyOn(service, "getAll").and.returnValue(of(mockBranches));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.branches).toEqual(mockBranches);
    expect(component.branches.length).toEqual(2)
  });

  it("should error on null getAll value", () => {
    spyOn(service, "getAll").and.returnValue(throwError({ status: 404 }));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.branches).toBeUndefined();
  });

  it("should ignore setpage out-of-bounds", () => {
    let retVal = component.setPage(0);
    expect(retVal).toEqual(1);
  });

  it("should open a modal window", fakeAsync(() => {
    const mockBranch = {
      "branchId": 3,
      "branchName": "Arlington Public Library",
      "branchAddress": "Arlington, VA"
    };

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    component.open("editBranchModal", mockBranch);
    expect(service).toBeTruthy();
  }));

  it("should open a modal window for create", fakeAsync(() => {
    spyOn(modalService, "open").and.returnValue(mockModalRef);
    component.open("editBranchModal", null);
    expect(service).toBeTruthy();
  }));

  it("should close a modal window", fakeAsync(() => {
    const mockBranch = {
      "branchId": 3,
      "branchName": "Arlington Public Library",
      "branchAddress": "Arlington, VA"
    };

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    mockModalRef.result = new Promise((resolve, reject) => reject("error"));
    component.open("editBranchModal", mockBranch);
    tick();
    expect(component.closeResult).toBe("Dismissed");
  }));

  it("should be able to show all results if no search", fakeAsync(() => {
    const mockBranches = [
      {
        "branchId": 3,
        "branchName": "Arlington Public Library",
        "branchAddress": "Arlington, VA"
      },
      {
        "branchId": 10,
        "branchName": "Ashburn Library",
        "branchAddress": "Ashburn, VA"
      }
    ];
    spyOn(component, "loadAllBranches");
    spyOn(service, "getAll").and.returnValue(of(mockBranches));
    expect(service).toBeTruthy();
    component.search();
    tick();
  }));

  it("should be able to search", fakeAsync(() => {
    const mockBranches = [
      {
        "branchId": 10,
        "branchName": "Ashburn Library",
        "branchAddress": "Ashburn, VA"
      }
    ];

    component.searchForm.value.searchString = 'Ashburn';
    spyOn(service, "getAll").and.returnValue(of(mockBranches));
    spyOn(component, "setPage");
    expect(service).toBeTruthy();
    component.search();
    tick();
    expect(mockBranches.length).toEqual(1);
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
    const mockBranches = [
      {
        "branchId": 10,
        "branchName": "Downtown Library",
        "branchAddress": "Ashburn, VA"
      }
    ];

    component.updateBranchForm.value.branchId = 10;
    component.updateBranchForm.value.branchName = "Ashburn Library";
    component.updateBranchForm.value.branchAddress = "Ashburn, VA";

    spyOn(service, "updateObj").and.returnValue(of(mockBranches));
    spyOn(component, "loadAllBranches");
    component.updateBranch();
    expect(component.loadAllBranches).toHaveBeenCalled();
  }));

  it("should be able to create", fakeAsync(() => {
    const mockBorrowers = [
      {
        "branchId": 2,
        "branchName": "Downtown Library",
        "branchAddress": "Ashburn, VA"
      }
    ];

    component.updateBranchForm.value.cardNo = null;
    component.updateBranchForm.value.name = "Downtown Library";
    component.updateBranchForm.value.address = "Ashburn, VA, VA";

    spyOn(service, "postObj").and.returnValue(of(mockBorrowers));
    spyOn(component, "loadAllBranches");
    component.updateBranch();
    expect(component.loadAllBranches).toHaveBeenCalled();
  }));
});
