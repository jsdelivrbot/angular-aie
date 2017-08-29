import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginValidateComponent } from './login-validate.component';

describe('LoginValidateComponent', () => {
  let component: LoginValidateComponent;
  let fixture: ComponentFixture<LoginValidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginValidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
