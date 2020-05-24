import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css']
})
export class GenreComponent implements OnInit {

  totalGenres: number;
  genres: any;
  today = new Date();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadAllPublishers();
  }

  loadAllPublishers() {
    this.http.get('http://localhost:3000/lms/admin/genres')
      .subscribe((res) => {
        this.genres = res;
        this.totalGenres = this.genres.length;
      },
        (error) => {
          ;
        }
      );
  }

}
