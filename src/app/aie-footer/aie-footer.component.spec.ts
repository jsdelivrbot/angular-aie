import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AieFooterComponent } from './aie-footer.component';

describe('AieFooterComponent', () => {
  let component: AieFooterComponent;
  let fixture: ComponentFixture<AieFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AieFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AieFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
