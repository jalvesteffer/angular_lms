import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.css']
})
export class PublisherComponent implements OnInit {

  totalPublishers: number;
  publishers: any;
  today = new Date();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadAllPublishers();
  }

  loadAllPublishers() {
    this.http.get('http://localhost:3000/lms/admin/publishers')
      .subscribe((res) => {
        this.publishers = res;
        this.totalPublishers = this.publishers.length;
      },
        (error) => {
          ;
        }
      );
  }
}
