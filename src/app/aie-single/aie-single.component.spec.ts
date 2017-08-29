import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostAcctSelectComponent } from '../common-components/cost-acct-select.component';
import { SalesCodeSelectComponent } from '../common-components/sales-code-select.component';
import { AieSingleComponent } from './aie-single.component';

describe('AieSingleComponent', () => {
  let component: AieSingleComponent;
  let fixture: ComponentFixture<AieSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AieSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AieSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
