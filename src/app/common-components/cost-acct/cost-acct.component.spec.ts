import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostAcctComponent } from './cost-acct.component';

describe('CostAcctComponent', () => {
  let component: CostAcctComponent;
  let fixture: ComponentFixture<CostAcctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostAcctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostAcctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
