import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificationSelectComponent } from './justification-select.component';

describe('JustificationSelectComponent', () => {
  let component: JustificationSelectComponent;
  let fixture: ComponentFixture<JustificationSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JustificationSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JustificationSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
