import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-borrower-admin',
  templateUrl: './borrower-admin.component.html',
  styleUrls: ['./borrower-admin.component.css']
})
export class BorrowerAdminComponent implements OnInit {

  totalBorrowers: number;
  borrowers: any;
  today = new Date();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadAllBorrowers();
  }

  loadAllBorrowers() {
    this.http.get('http://localhost:3000/lms/admin/borrowers')
      .subscribe((res) => {
        this.borrowers = res;
        this.totalBorrowers = this.borrowers.length;
      },
        (error) => {
          ;
        }
      );
  }
}
