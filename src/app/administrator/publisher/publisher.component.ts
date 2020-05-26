import { Component, OnInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private lmsService: LmsService, private modalService: NgbModal) { }

  ngOnInit() {
    this.loadAllPublishers();
  }

  loadAllPublishers() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readPublishersURI}`)
      .subscribe((res) => {
        this.publishers = res;
        this.totalPublishers = this.publishers.length;
      },
        (error) => {
          ;
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
    this.lmsService.updateObj(`${environment.appUrl}${environment.updatePublishersURI}`, this.selectedObj)
      .subscribe((res) => {
        this.loadAllPublishers();
        this.modalService.dismissAll();
      },
        (error) => {
          ;
        }
      );
  }

  open(content, obj) {
    this.selectedObj = obj;
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
}
