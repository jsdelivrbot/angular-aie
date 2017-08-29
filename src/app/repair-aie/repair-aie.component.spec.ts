import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairAieComponent } from './repair-aie.component';

describe('RepairAieComponent', () => {
  let component: RepairAieComponent;
  let fixture: ComponentFixture<RepairAieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairAieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairAieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
