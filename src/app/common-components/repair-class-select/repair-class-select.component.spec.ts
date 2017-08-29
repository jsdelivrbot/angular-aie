import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairClassSelectComponent } from './repair-class-select.component';

describe('RepairClassSelectComponent', () => {
  let component: RepairClassSelectComponent;
  let fixture: ComponentFixture<RepairClassSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairClassSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairClassSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
