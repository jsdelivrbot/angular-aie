import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AieMiscComponent } from './aie-misc.component';

describe('AieMiscComponent', () => {
  let component: AieMiscComponent;
  let fixture: ComponentFixture<AieMiscComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AieMiscComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AieMiscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
