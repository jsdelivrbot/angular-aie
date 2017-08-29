import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AieHeaderComponent } from './aie-header.component';

describe('AieHeaderComponent', () => {
  let component: AieHeaderComponent;
  let fixture: ComponentFixture<AieHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AieHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AieHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
