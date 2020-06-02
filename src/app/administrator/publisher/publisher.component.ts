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

  // Pagination
  pager: any = {};
  pagedResults: any[];

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

  onItemSelect() { }

  initializeFormGroup() {
    this.updatePublisherForm = new FormGroup({
      publisherName: new FormControl(this.publisherName, [
        Validators.required,
        Validators.maxLength(45),
        Validators.minLength(3),
      ]),
      publisherId: new FormControl(this.publisherId),
      publisherAddress: new FormControl(this.publisherAddress),
      publisherPhone: new FormControl(this.publisherPhone)
    });
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

  deletePublisher(publisherId) {

    this.lmsService.deleteObj(`${environment.appUrl}${environment.deletePublishersURI}`, publisherId)
      .subscribe((res) => {
        this.loadAllPublishers();
      },
        (error) => {
          ;
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
        },
          (error) => {
            console.log("error with postObj");
          }
        );
    }
    // otherwise, perform update
    else {
      this.lmsService.updateObj(`${environment.appUrl}${environment.updatePublishersURI}`, publisher)
        .subscribe((res) => {
          this.loadAllPublishers();
          this.modalService.dismissAll();
        },
          (error) => {
            console.log("error with updateObj");
          }
        );
    }
  }

  open(content, obj) {
    if (obj !== null) {
      this.updatePublisherForm = this.fb.group({
        publisherId: obj.publisherId,
        publisherName: obj.publisherName,
        publisherAddress: obj.publisherAddress,
        publisherPhone: obj.publisherPhone
      })
    } else {
      this.updatePublisherForm = this.fb.group({
        publisherId: null,
        publisherName: "",
        publisherAddress: null,
        publisherPhone: null
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
      return;
    }
    this.pager = this.pagerService.getPager(this.totalPublishers, page, 10);
    this.pagedResults = this.publishers.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }
}
