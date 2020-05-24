import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LmserrorComponent } from './lmserror.component';

describe('LmserrorComponent', () => {
  let component: LmserrorComponent;
  let fixture: ComponentFixture<LmserrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LmserrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LmserrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
