import { BookComponent } from './book.component';
import { LmsService } from '../../common/services/lms.service';
import { PagerService } from '../../common/services/pager.service';
import { Observable, from, of, observable, throwError } from "rxjs";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators, NgModel } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from "@angular/forms";
import { Pipe, PipeTransform } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync
} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { resolve } from 'url';

@Pipe({
  name: 'titleSort'
})
export class MockBookCopiesSortPipe implements PipeTransform {
  transform(input: any[]): any { }
}

//Mock modal reference class
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve("x"));
}

describe('BookComponent', () => {
  let component: BookComponent;
  let fixture: ComponentFixture<BookComponent>;
  let service: LmsService;
  let pagerService: PagerService;
  let modalService: NgbModal;
  let fb: FormBuilder;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookComponent, MockBookCopiesSortPipe],
      imports: [
        NgbModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgMultiSelectDropDownModule,
        HttpClientTestingModule,
      ],
      providers: [LmsService, PagerService],
    }).compileComponents();
    service = new LmsService(null);
    pagerService = new PagerService();
    fb = new FormBuilder();
    modalService = TestBed.get(NgbModal);
    component = new BookComponent(service, pagerService, modalService, fb);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookComponent);
    component.searchForm = fb.group({
      searchString: [""]
    })

    component.updateBookForm = fb.group({
      bookId: [""],
      title: [""],
      pubId: [""],
      authors: [""],
      publisher: [""],
      genres: [""]
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should load components and call life cycle methods", () => {
    spyOn(component, "loadAllBooks");
    component.ngOnInit();

    expect(component.loadAllBooks).toHaveBeenCalled;
  });

  it("should load all books via a mock-service - return mock data", () => {
    const mockBooks = [
      {
        "bookId": 101,
        "title": "1984",
        "pubId": 2,
        "publisher": [
          {
            "publisherId": 2,
            "publisherName": "Penguin Random House"
          }
        ],
        "authors": [
          {
            "authorId": 70,
            "authorName": "George Orwell"
          }
        ],
        "genres": [
          {
            "genre_id": 3,
            "genre_name": "Literature"
          }
        ]
      },
      {
        "bookId": 99,
        "title": "A Brief History of Time",
        "pubId": 2,
        "publisher": [
          {
            "publisherId": 2,
            "publisherName": "Penguin Random House"
          }
        ],
        "authors": [
          {
            "authorId": 64,
            "authorName": "Stephen Hawking"
          }
        ],
        "genres": [
          {
            "genre_id": 28,
            "genre_name": "Science & Math"
          },
          {
            "genre_id": 33,
            "genre_name": "Non-Fiction"
          }
        ]
      }
    ];

    spyOn(service, "getAll").and.returnValue(of(mockBooks));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.books).toEqual(mockBooks);
    expect(component.books.length).toEqual(2)
  });

  it("should error on null getAll value", () => {
    spyOn(service, "getAll").and.returnValue(throwError({ status: 404 }));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.books).toBeUndefined();
  });

  it("should error on null getAll authors value", () => {
    spyOn(service, "getAll").and.returnValue(throwError({ status: 404 }));
    component.loadAllAuthors();
    expect(service).toBeTruthy();
    expect(component.authors).toBeUndefined();
  });

  it("should error on null getAll publishers value", () => {
    spyOn(service, "getAll").and.returnValue(throwError({ status: 404 }));
    component.loadAllPublishers();
    expect(service).toBeTruthy();
    expect(component.publisher).toBeUndefined();
  });

  it("should error on null getAll genres value", () => {
    spyOn(service, "getAll").and.returnValue(throwError({ status: 404 }));
    component.loadAllGenres();
    expect(service).toBeTruthy();
    expect(component.genres).toBeUndefined();
  });

  it("should ignore setpage out-of-bounds", () => {
    let retVal = component.setPage(0);
    expect(retVal).toEqual(1);
  });

  it("should open a modal window", fakeAsync(() => {
    const mockAuthors = [
      {
        "authorId": 68,
        "authorName": "Alice Schroeder"
      },
      {
        "authorId": 26,
        "authorName": "Brandon Sanderson"
      }
    ];

    const mockBook = {
      "bookId": 101,
      "title": "1984",
      "pubId": 2,
      "publisher": [
        {
          "publisherId": 2,
          "publisherName": "Penguin Random House"
        }
      ],
      "authors": [
        {
          "authorId": 70,
          "authorName": "George Orwell"
        }
      ],
      "genres": [
        {
          "genre_id": 3,
          "genre_name": "Literature"
        }
      ]
    }

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    spyOn(service, "getAll").and.returnValue(of(mockAuthors));
    component.open("editBookModal", mockBook);
    expect(service).toBeTruthy();
    expect(component.totalAuthors).toEqual(mockAuthors);
    expect(component.totalAuthors.length).toEqual(2)
  }));

  it("should open a modal window for create", fakeAsync(() => {
    const mockAuthors = [
      {
        "authorId": 68,
        "authorName": "Alice Schroeder"
      },
      {
        "authorId": 26,
        "authorName": "Brandon Sanderson"
      }
    ];

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    spyOn(service, "getAll").and.returnValue(of(mockAuthors));
    component.open("editBookModal", null);
    expect(service).toBeTruthy();
  }));

  it("should close a modal window", fakeAsync(() => {
    const mockBook =
    {
      "bookId": 101,
      "title": "1984",
      "pubId": 2,
      "publisher": [
        {
          "publisherId": 2,
          "publisherName": "Penguin Random House"
        }
      ],
      "authors": [
        {
          "authorId": 70,
          "authorName": "George Orwell"
        }
      ],
      "genres": [
        {
          "genre_id": 3,
          "genre_name": "Literature"
        }
      ]
    };

    const mockAuthors = [
      {
        "authorId": 68,
        "authorName": "Alice Schroeder"
      },
      {
        "authorId": 26,
        "authorName": "Brandon Sanderson"
      }
    ];

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    spyOn(service, "getAll").and.returnValue(of(mockAuthors));
    mockModalRef.result = new Promise((resolve, reject) => reject("error"));
    component.open("editBookModal", mockBook);
    tick();
    expect(component.closeResult).toBe("Dismissed");
  }));

  it("should be able to show all results if no search", fakeAsync(() => {
    const mockBooks = [
      {
        "bookId": 101,
        "title": "1984",
        "pubId": 2,
        "publisher": [
          {
            "publisherId": 2,
            "publisherName": "Penguin Random House"
          }
        ],
        "authors": [
          {
            "authorId": 70,
            "authorName": "George Orwell"
          }
        ],
        "genres": [
          {
            "genre_id": 3,
            "genre_name": "Literature"
          }
        ]
      },
      {
        "bookId": 99,
        "title": "A Brief History of Time",
        "pubId": 2,
        "publisher": [
          {
            "publisherId": 2,
            "publisherName": "Penguin Random House"
          }
        ],
        "authors": [
          {
            "authorId": 64,
            "authorName": "Stephen Hawking"
          }
        ],
        "genres": [
          {
            "genre_id": 28,
            "genre_name": "Science & Math"
          },
          {
            "genre_id": 33,
            "genre_name": "Non-Fiction"
          }
        ]
      }
    ];
    spyOn(component, "loadAllBooks");
    spyOn(service, "getAll").and.returnValue(of(mockBooks));
    expect(service).toBeTruthy();
    component.search();
    tick();
  }));

  it("should be able to search", fakeAsync(() => {
    const mockBooks = [
      {
        "bookId": 101,
        "title": "1984",
        "pubId": 2,
        "publisher": [
          {
            "publisherId": 2,
            "publisherName": "Penguin Random House"
          }
        ],
        "authors": [
          {
            "authorId": 70,
            "authorName": "George Orwell"
          }
        ],
        "genres": [
          {
            "genre_id": 3,
            "genre_name": "Literature"
          }
        ]
      }
    ];

    component.searchForm.value.searchString = '1984';
    spyOn(service, "getAll").and.returnValue(of(mockBooks));
    spyOn(component, "setPage");
    expect(service).toBeTruthy();
    component.search();
    tick();
    expect(mockBooks.length).toEqual(1);
  }));

  it("should return an error on search exception", fakeAsync(() => {
    component.searchForm.value.searchString = 'king';
    spyOn(service, "getAll").and.returnValue(throwError({ status: 404 }));
    expect(service).toBeTruthy();
    component.search();
    tick();
    expect(component.searchString).toEqual("");
  }));

  it("should be able to update", fakeAsync(() => {
    const mockBooks = [
      {
        "bookId": 101,
        "title": "1985",
        "pubId": 2
      }
    ];

    component.updateBookForm.value.bookId = 101;
    component.updateBookForm.value.title = "Stephen King";
    component.updateBookForm.value.pubId = 2;
    component.updateBookForm.value.authors = null;
    component.updateBookForm.value.publisher = null;
    component.updateBookForm.value.genres = null;

    spyOn(service, "updateObj").and.returnValue(of(mockBooks));
    spyOn(component, "loadAllBooks");
    component.updateBook();
    expect(component.loadAllBooks).toHaveBeenCalled();
  }));
});