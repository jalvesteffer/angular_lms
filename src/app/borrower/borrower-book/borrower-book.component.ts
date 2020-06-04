import { Component, OnInit, Input } from '@angular/core';
import { Book } from '../book';

@Component({
  selector: 'app-borrower-book',
  templateUrl: './borrower-book.component.html',
  styleUrls: ['./borrower-book.component.css']
})
export class BorrowerBookComponent implements OnInit {
  @Input('book') data: Book;

  constructor() { }

  ngOnInit() {
  }

}
