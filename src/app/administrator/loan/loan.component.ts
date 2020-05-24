import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {

  totalLoans: number;
  loans: any;
  today = new Date();

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

}
