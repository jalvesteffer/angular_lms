import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerBookComponent } from './borrower-book.component';

describe('BorrowerBookComponent', () => {
  let component: BorrowerBookComponent;
  let fixture: ComponentFixture<BorrowerBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
