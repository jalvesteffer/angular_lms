import { GenreComponent } from './genre.component';
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
  name: 'genreSort'
})
export class MockGenreSortPipe implements PipeTransform {
  transform(input: any[]): any { }
}

//Mock modal reference class
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve("x"));
}

describe('GenreComponent', () => {
  let component: GenreComponent;
  let fixture: ComponentFixture<GenreComponent>;
  let service: LmsService;
  let pagerService: PagerService;
  let modalService: NgbModal;
  let fb: FormBuilder;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenreComponent, MockGenreSortPipe],
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
    component = new GenreComponent(service, pagerService, modalService, fb);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreComponent);
    component.searchForm = fb.group({
      searchString: [""]
    })

    component.updateGenreForm = fb.group({
      genre_id: [""],
      genre_name: [""],
      books: [""]
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should load components and call life cycle methods", () => {
    spyOn(component, "loadAllGenres");
    component.ngOnInit();

    expect(component.loadAllGenres).toHaveBeenCalled;
  });

  it("should load all genres via a mock-service - return mock data", () => {
    const mockGenres = [
      {
        "genre_id": 38,
        "genre_name": "Biographies & Memoirs"
      },
      {
        "genre_id": 35,
        "genre_name": "Business"
      }
    ];

    spyOn(service, "getAll").and.returnValue(of(mockGenres));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.genres).toEqual(mockGenres);
    expect(component.genres.length).toEqual(2)
  });

  it("should error on null getAll value", () => {
    spyOn(service, "getAll").and.returnValue(throwError({ status: 404 }));
    component.ngOnInit();
    expect(service).toBeTruthy();
    expect(component.genres).toBeUndefined();
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
    const mockGenre =
    {
      "genre_id": 38,
      "genre_name": "Biographies & Memoirs"
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
    component.open("editGenreModal", mockGenre);
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
    component.open("editGenreModal", null);
    expect(service).toBeTruthy();
  }));

  it("should close a modal window", fakeAsync(() => {
    const mockGenre =
    {
      "genre_id": 38,
      "genre_name": "Biographies & Memoirs"
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
    component.open("editAuthorModal", mockGenre);
    tick();
    expect(component.closeResult).toBe("Dismissed");
  }));

  it("should be able to show all results if no search", fakeAsync(() => {
    const mockGenres = [
      {
        "genre_id": 38,
        "genre_name": "Biographies & Memoirs"
      },
      {
        "genre_id": 35,
        "genre_name": "Business"
      }
    ];
    spyOn(component, "loadAllGenres");
    spyOn(service, "getAll").and.returnValue(of(mockGenres));
    expect(service).toBeTruthy();
    component.search();
    tick();
  }));

  it("should be able to search", fakeAsync(() => {
    const mockGenres = [
      {
        "genre_id": 35,
        "genre_name": "Business"
      }
    ];

    component.searchForm.value.searchString = 'Business';
    spyOn(service, "getAll").and.returnValue(of(mockGenres));
    spyOn(component, "setPage");
    expect(service).toBeTruthy();
    component.search();
    tick();
    expect(mockGenres.length).toEqual(1);
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
    const mockGenres = [
      {
        "genre_id": 35,
        "genre_name": "Economics"
      }
    ];

    component.updateGenreForm.value.genre_id = 35;
    component.updateGenreForm.value.genre_name = "Business Books";
    component.updateGenreForm.value.books = null;

    spyOn(service, "updateObj").and.returnValue(of(mockGenres));
    spyOn(component, "loadAllGenres");
    component.updateGenre();
    expect(component.loadAllGenres).toHaveBeenCalled();
  }));
});
