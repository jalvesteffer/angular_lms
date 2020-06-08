import { Component, OnInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { PagerService } from "../../common/services/pager.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms"

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.css']
})
export class PublisherComponent implements OnInit {

  totalPublishers: number;
  publishers: any;
  today = new Date();
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  selectedObj: any;
  updatePublisherForm: FormGroup;
  publisherName: string;
  publisherId: number;
  publisherAddress: string;
  publisherPhone: string;
  dropdownSettings: any;

  // For CRUD feedback
  feedbackMsg: string;
  feedbackStyle: string;

  // Sort
  searchForm: FormGroup;
  searchString: string;

  // Pagination
  pager: any = {};
  pagedResults: any[];
  pageSize: number = 10;

  constructor(
    private lmsService: LmsService,
    private pagerService: PagerService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: "publisherId",
      textField: "publisherName",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  ngOnInit() {
    this.loadAllPublishers();
    this.initializeFormGroup();
  }

  // onItemSelect() { }

  initializeFormGroup() {
    this.updatePublisherForm = new FormGroup({
      publisherName: new FormControl(this.publisherName),
      publisherId: new FormControl(this.publisherId),
      publisherAddress: new FormControl(this.publisherAddress),
      publisherPhone: new FormControl(this.publisherPhone)
    });

    this.searchForm = new FormGroup({
      searchString: new FormControl(this.searchString),
    });
  }

  search() {
    let searchString = this.searchForm.value.searchString;
    let dash = "/";
    if (searchString.length != 0) {
      this.lmsService
        .getAll(
          `${environment.appUrl}${environment.readPublishersURI}${environment.likeURI}${dash}${searchString}`
        )
        .subscribe(
          (res) => {
            this.publishers = res;
            this.totalPublishers = this.publishers.length;
            this.searchString = "";
            this.setPage(1);
          },
          (error) => {
            this.searchString = "";
          }
        );
    } else {
      this.searchString = "";
      this.loadAllPublishers();
    }
  }

  loadAllPublishers() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readPublishersURI}`)
      .subscribe((res) => {
        this.publishers = res;
        this.totalPublishers = this.publishers.length;
        this.setPage(1);
      },
        (error) => {
          console.log("Error with loadAllPublishers");
        }
      );
  }

  deletePublisher(publisher) {

    this.lmsService.deleteObj(`${environment.appUrl}${environment.deletePublishersURI}`, publisher.publisherId)
      .subscribe((res) => {
        this.loadAllPublishers();
        this.feedbackStyle = "successMsg";
        this.feedbackMsg = publisher.publisherName + " was deleted";
      },
        (error) => {
          this.feedbackStyle = "failureMsg";
          this.feedbackMsg = publisher.publisherName + " could not be deleted";
        }
      );
  }

  updatePublisher() {
    const publisher = {
      publisherId: this.updatePublisherForm.value.publisherId,
      publisherName: this.updatePublisherForm.value.publisherName,
      publisherAddress: this.updatePublisherForm.value.publisherAddress,
      publisherPhone: this.updatePublisherForm.value.publisherPhone
    }

    // perform insert if no publisher id set
    if (!publisher.publisherId) {
      this.lmsService.postObj(`${environment.appUrl}${environment.createPublishersURI}`, publisher)
        .subscribe((res) => {
          this.loadAllPublishers();
          this.modalService.dismissAll();

          this.feedbackStyle = "successMsg";
          this.feedbackMsg = publisher.publisherName + " was created";
        },
          (error) => {
            this.feedbackStyle = "failureMsg";
            this.feedbackMsg = publisher.publisherName + " could not be created";
          }
        );
    }
    // otherwise, perform update
    else {
      this.lmsService.updateObj(`${environment.appUrl}${environment.updatePublishersURI}`, publisher)
        .subscribe((res) => {
          this.loadAllPublishers();
          this.modalService.dismissAll();

          this.feedbackStyle = "successMsg";
          this.feedbackMsg = publisher.publisherName + " was updated";
        },
          (error) => {
            this.feedbackStyle = "failureMsg";
            this.feedbackMsg = publisher.publisherName + " could not be updated";
          }
        );
    }
  }

  open(content, obj) {
    if (obj !== null) {
      this.updatePublisherForm = this.fb.group({
        publisherId: obj.publisherId,
        publisherName: [obj.publisherName, [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
        publisherAddress: [obj.publisherAddress, [Validators.minLength(3), Validators.maxLength(45)]],
        publisherPhone: [obj.publisherPhone, [Validators.minLength(10), Validators.maxLength(45)]]
      })
    } else {
      this.updatePublisherForm = this.fb.group({
        publisherId: null,
        publisherName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
        publisherAddress: ["", [Validators.minLength(3), Validators.maxLength(45)]],
        publisherPhone: ["", [Validators.minLength(10), Validators.maxLength(45)]]
      })
    }

    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then(
      (result) => {
        this.errMsg = "";
        this.closeResult = `Closed with ${result}`;
      },
      (reason) => {
        this.errMsg = "";
        this.closeResult = `Dismissed`;
      }
    );
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPublishers) {
      return 1;
    }
    this.pager = this.pagerService.getPager(this.totalPublishers, page, this.pageSize);
    this.pagedResults = this.publishers.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }
}
