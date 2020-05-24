import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerAdminComponent } from './borrower-admin.component';

describe('BorrowerAdminComponent', () => {
  let component: BorrowerAdminComponent;
  let fixture: ComponentFixture<BorrowerAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
