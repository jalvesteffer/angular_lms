import { PublisherComponent } from './publisher.component';
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
  name: 'publisherSort'
})
export class MockPublisherSortPipe implements PipeTransform {
  transform(input: any[]): any { }
}

//Mock modal reference class
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve("x"));
}

describe('PublisherComponent', () => {
  let component: PublisherComponent;
  let fixture: ComponentFixture<PublisherComponent>;
  let service: LmsService;
  let pagerService: PagerService;
  let modalService: NgbModal;
  let fb: FormBuilder;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublisherComponent, MockPublisherSortPipe],
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
    component = new PublisherComponent(service, pagerService, modalService, fb);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisherComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should load components and call life cycle methods", () => {
    spyOn(component, "loadAllPublishers");
    component.ngOnInit();

    expect(component.loadAllPublishers).toHaveBeenCalled;
  });

  it("should load all publishers via a mock-service - return mock data", () => {
    const mockPublishers = [
      {
        "publisherId": 19,
        "publisherName": "Anchor Books",
        "publisherAddress": "New York, USA",
        "publisherPhone": "365-659-6598"
      },
      {
        "publisherId": 10,
        "publisherName": "Bantam Books",
        "publisherAddress": "New York, USA",
        "publisherPhone": "785-578-8785"
      }
    ];

    spyOn(service, "getAll").and.returnValue(of(mockPublishers));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.publishers).toEqual(mockPublishers);
    expect(component.publishers.length).toEqual(2)
  });

  it("should error on null getAll value", () => {
    spyOn(service, "getAll").and.returnValue(throwError({ status: 404 }));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.publishers).toBeUndefined();
  });

  it("should ignore setpage out-of-bounds", () => {
    let retVal = component.setPage(0);
    expect(retVal).toEqual(1);
  });

  it("should open a modal window", fakeAsync(() => {
    const mockPublisher = {
      "publisherId": 19,
      "publisherName": "Anchor Books",
      "publisherAddress": "New York, USA",
      "publisherPhone": "365-659-6598"
    };

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    component.open("editPublisherModal", mockPublisher);
    expect(service).toBeTruthy();
  }));

  it("should open a modal window for create", fakeAsync(() => {
    spyOn(modalService, "open").and.returnValue(mockModalRef);
    component.open("editPublisherModal", null);
    expect(service).toBeTruthy();
  }));

  it("should close a modal window", fakeAsync(() => {
    const mockPublisher = {
      "publisherId": 19,
      "publisherName": "Anchor Books",
      "publisherAddress": "New York, USA",
      "publisherPhone": "365-659-6598"
    };

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    mockModalRef.result = new Promise((resolve, reject) => reject("error"));
    component.open("editPublisherModal", mockPublisher);
    tick();
    expect(component.closeResult).toBe("Dismissed");
  }));
});
