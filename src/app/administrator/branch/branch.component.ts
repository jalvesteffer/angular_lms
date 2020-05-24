import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {

  totalBranches: number;
  branches: any;
  today = new Date();

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

}
