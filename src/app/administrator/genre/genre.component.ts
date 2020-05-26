import { Component, OnInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css']
})
export class GenreComponent implements OnInit {

  totalGenres: number;
  genres: any;
  today = new Date();
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  selectedObj: any;

  constructor(private lmsService: LmsService, private modalService: NgbModal) { }

  ngOnInit() {
    this.loadAllGenres();
  }

  loadAllGenres() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readGenresURI}`)
      .subscribe((res) => {
        this.genres = res;
        this.totalGenres = this.genres.length;
      },
        (error) => {
          ;
        }
      );
  }

  deleteGenre(genre_id) {

    this.lmsService.deleteObj(`${environment.appUrl}${environment.deleteGenresURI}`, genre_id)
      .subscribe((res) => {
        this.loadAllGenres();
      },
        (error) => {
          ;
        }
      );
  }

  updateGenre() {
    this.lmsService.updateObj(`${environment.appUrl}${environment.updateGenresURI}`, this.selectedObj)
      .subscribe((res) => {
        this.loadAllGenres();
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
