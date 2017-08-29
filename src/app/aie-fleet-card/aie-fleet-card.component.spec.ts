import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AieFleetCardComponent } from './aie-fleet-card.component';

describe('AieFleetCardComponent', () => {
  let component: AieFleetCardComponent;
  let fixture: ComponentFixture<AieFleetCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AieFleetCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AieFleetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
