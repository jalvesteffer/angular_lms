import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LmsService {

  constructor(private http: HttpClient) { }

  getAll(url) {
    return this.http.get(url);
  }

  deleteObj(url, id: number) {

    const paramUrl = `${url}/${id}`;
    const options = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Methods': '*'
      })
    };

    return this.http.delete(paramUrl, options);
  }

  updateObj(url, obj) {
    return this.http.put(url, obj);
  }
}
