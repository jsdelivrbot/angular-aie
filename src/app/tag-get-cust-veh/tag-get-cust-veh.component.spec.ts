import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagGetCustVehComponent } from './tag-get-cust-veh.component';

describe('TagGetCustVehComponent', () => {
  let component: TagGetCustVehComponent;
  let fixture: ComponentFixture<TagGetCustVehComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagGetCustVehComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagGetCustVehComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
