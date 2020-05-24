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
    this.loadAllBranches();
  }

  loadAllBranches() {
    this.http.get('http://localhost:3000/lms/admin/branches')
      .subscribe((res) => {
        this.branches = res;
        this.totalBranches = this.branches.length;
      },
        (error) => {
          ;
        }
      );
  }
}
