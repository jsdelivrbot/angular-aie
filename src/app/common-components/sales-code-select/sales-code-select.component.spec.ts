import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCodeSelectComponent } from './sales-code-select.component';

describe('SalesCodeSelectComponent', () => {
  let component: SalesCodeSelectComponent;
  let fixture: ComponentFixture<SalesCodeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesCodeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesCodeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
