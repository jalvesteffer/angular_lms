import { AuthorComponent } from './author.component';
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
  name: "authorSort"
})
export class MockAuthorSortPipe implements PipeTransform {
  transform(input: any[]): any { }
}

// mock modal reference class
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve("x"));
}

describe('AuthorComponent', () => {
  let component: AuthorComponent;
  let service: LmsService;
  let pagerService: PagerService;
  let modalService: NgbModal;
  let fb: FormBuilder;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();
  let fixture: ComponentFixture<AuthorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorComponent, MockAuthorSortPipe],
      imports: [
        NgbModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgMultiSelectDropDownModule,
        HttpClientTestingModule
      ],
      providers: [
        LmsService, PagerService
      ]
    }).compileComponents();
    service = new LmsService(null);
    pagerService = new PagerService();
    fb = new FormBuilder();
    modalService = TestBed.get(NgbModal);

    component = new AuthorComponent(service, pagerService, modalService, fb);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorComponent);
    component.searchForm = fb.group({
      searchString: [""]
    });

    component.updateAuthorForm = fb.group({
      authorId: [""],
      authorName: [""],
      books: [""]
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should load components and call life cycle methods", () => {
    spyOn(component, "loadAllAuthors");
    component.ngOnInit();

    expect(component.loadAllAuthors).toHaveBeenCalled;
  });

  it("should load all authors via a mock-service - return mock data", () => {
    const mockAuthors = [
      {
        "authorId": 1,
        "authorName": "Stephen King",
        "books": [
          {
            "bookId": 2,
            "title": "The Shining"
          },
          {
            "bookId": 98,
            "title": "Sleeping Beauties"
          },
          {
            "bookId": 100,
            "title": "The Stand"
          }
        ]
      },
      {
        "authorId": 82,
        "authorName": "Tom Stern"
      }
    ];

    spyOn(service, "getAll").and.returnValue(of(mockAuthors));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.authors).toEqual(mockAuthors);
    expect(component.authors.length).toEqual(2)
  });

  it("should error on null getAll value", () => {
    spyOn(service, "getAll").and.returnValue(throwError({ status: 404 }));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.authors).toBeUndefined();
  });

  it("should error on null getAll books value", () => {
    spyOn(service, "getAll").and.returnValue(throwError({ status: 404 }));
    component.loadAllBooks();
    expect(service).toBeTruthy();
    expect(component.books).toBeUndefined();
  });

  it("should ignore setpage out-of-bounds", () => {
    let retVal = component.setPage(0);
    expect(retVal).toEqual(1);
  });

  it("should open a modal window", fakeAsync(() => {
    const mockAuthor =
    {
      "authorId": 1,
      "authorName": "Stephen King",
      "books": [
        {
          "bookId": 2,
          "title": "The Shining"
        },
        {
          "bookId": 98,
          "title": "Sleeping Beauties"
        },
        {
          "bookId": 100,
          "title": "The Stand"
        }
      ]
    };

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

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    spyOn(service, "getAll").and.returnValue(of(mockBooks));
    component.open("editAuthorModal", mockAuthor);
    expect(service).toBeTruthy();
    expect(component.totalBooks).toEqual(mockBooks);
    expect(component.totalBooks.length).toEqual(2)
  }));

  it("should open a modal window for create", fakeAsync(() => {

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

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    spyOn(service, "getAll").and.returnValue(of(mockBooks));
    component.open("editAuthorModal", null);
    expect(service).toBeTruthy();
  }));

  // it("should update author", fakeAsync(() => {
  //   const mockAuthor =
  //   {
  //     "authorId": 1,
  //     "authorName": "Stephen King",
  //     "books": [
  //       {
  //         "bookId": 2,
  //         "title": "The Shining"
  //       },
  //       {
  //         "bookId": 98,
  //         "title": "Sleeping Beauties"
  //       },
  //       {
  //         "bookId": 100,
  //         "title": "The Stand"
  //       }
  //     ]
  //   };

  //   const mockBooks = [
  //     {
  //       "bookId": 101,
  //       "title": "1984",
  //       "pubId": 2,
  //       "publisher": [
  //         {
  //           "publisherId": 2,
  //           "publisherName": "Penguin Random House"
  //         }
  //       ],
  //       "authors": [
  //         {
  //           "authorId": 70,
  //           "authorName": "George Orwell"
  //         }
  //       ],
  //       "genres": [
  //         {
  //           "genre_id": 3,
  //           "genre_name": "Literature"
  //         }
  //       ]
  //     },
  //     {
  //       "bookId": 99,
  //       "title": "A Brief History of Time",
  //       "pubId": 2,
  //       "publisher": [
  //         {
  //           "publisherId": 2,
  //           "publisherName": "Penguin Random House"
  //         }
  //       ],
  //       "authors": [
  //         {
  //           "authorId": 64,
  //           "authorName": "Stephen Hawking"
  //         }
  //       ],
  //       "genres": [
  //         {
  //           "genre_id": 28,
  //           "genre_name": "Science & Math"
  //         },
  //         {
  //           "genre_id": 33,
  //           "genre_name": "Non-Fiction"
  //         }
  //       ]
  //     }
  //   ];

  //   const author =
  //   {
  //     "authorId": 1,
  //     "authorName": "Stephen King",
  //     "books": [
  //       {
  //         "bookId": 2,
  //         "title": "The Shining"
  //       },
  //       {
  //         "bookId": 98,
  //         "title": "Sleeping Beauties"
  //       },
  //       {
  //         "bookId": 100,
  //         "title": "The Stand"
  //       }
  //     ]
  //   }

  //   spyOn(modalService, "open").and.returnValue(mockModalRef);
  //   spyOn(service, "getAll").and.returnValue(of(mockBooks));
  //   component.open("editAuthorModal", mockAuthor);
  //   component.updateAuthor();
  //   service.updateObj("some http", author).subscribe((res) => {
  //     expect(res.valueOf).toEqual({ status: 200 });
  //   });


  //   // , "updateObj").and.returnValue({ status: 200 });

  //   // spyOn(service, "postObj").and.returnValue(of(mockBooks));
  //   // component.open("editAuthorModal", mockAuthor);
  //   // expect(service).toBeTruthy();
  //   // spyOn(service, "getAll").and.returnValue(of(mockBooks));
  // }));

  it("should close a modal window", fakeAsync(() => {
    const mockAuthor =
    {
      "authorId": 1,
      "authorName": "Stephen King",
      "books": [
        {
          "bookId": 2,
          "title": "The Shining"
        },
        {
          "bookId": 98,
          "title": "Sleeping Beauties"
        },
        {
          "bookId": 100,
          "title": "The Stand"
        }
      ]
    };

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

    spyOn(modalService, "open").and.returnValue(mockModalRef);
    spyOn(service, "getAll").and.returnValue(of(mockBooks));
    mockModalRef.result = new Promise((resolve, reject) => reject("error"));
    component.open("editAuthorModal", mockAuthor);
    tick();
    expect(component.closeResult).toBe("Dismissed");
  }));

  it("should be able to show all results if no search", fakeAsync(() => {
    const mockAuthors = [
      {
        "authorId": 1,
        "authorName": "Stephen King",
        "books": [
          {
            "bookId": 2,
            "title": "The Shining"
          },
          {
            "bookId": 98,
            "title": "Sleeping Beauties"
          },
          {
            "bookId": 100,
            "title": "The Stand"
          }
        ]
      },
      {
        "authorId": 82,
        "authorName": "Tom Stern"
      }
    ];
    spyOn(component, "loadAllAuthors");
    spyOn(service, "getAll").and.returnValue(of(mockAuthors));
    expect(service).toBeTruthy();
    component.search();
    tick();
  }));

  it("should be able to search", fakeAsync(() => {
    const mockAuthors = [
      {
        "authorId": 1,
        "authorName": "Stephen King",
        "books": [
          {
            "bookId": 2,
            "title": "The Shining"
          }
        ]
      }
    ];

    component.searchForm.value.searchString = 'king';
    spyOn(service, "getAll").and.returnValue(of(mockAuthors));
    spyOn(component, "setPage");
    expect(service).toBeTruthy();
    component.search();
    tick();
    expect(mockAuthors.length).toEqual(1);
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
    const mockAuthors = [
      {
        "authorId": 1,
        "authorName": "Stephen Kingdom"
      }
    ];

    component.updateAuthorForm.value.authorId = 1;
    component.updateAuthorForm.value.authorName = "Stephen King";
    component.updateAuthorForm.value.books = null;

    spyOn(service, "updateObj").and.returnValue(of(mockAuthors));
    spyOn(component, "loadAllAuthors");
    component.updateAuthor();
    expect(component.loadAllAuthors).toHaveBeenCalled();
  }));

});