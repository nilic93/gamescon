import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFormComponent } from './login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { authServiceStub } from '../../../shared/mocks/auth-service-stub/auth.service.stub';
import { FormErrors } from 'app/shared/enums/form-errors/form-errors.enum';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let correctPassword: string;
  let correctEmail: string;
  let template: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginFormComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceStub,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    correctPassword = 'testTEST11!!';
    correctEmail = 'test@test.com';
    template = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test getPasswordInputError()', () => {
    test('should return empty string if input is correct', () => {
      const passwordControl = component.loginFormGroup.controls.password;
      passwordControl.setValue(correctPassword);
      passwordControl.markAsTouched();

      fixture.detectChanges();

      expect(template.querySelector('.error-wrapper__message')).toEqual(null);
    });

    test('should return "Password is required."', () => {
      const passwordControl = component.loginFormGroup.controls.password;
      passwordControl.setValue('');
      passwordControl.markAsTouched();

      fixture.detectChanges();

      expect(template.querySelector('.error-wrapper__message').textContent).toEqual(`${FormErrors.PASSWORD_REQUIRED} `);
    });

    describe('Test return password format error message', () => {
      test('if password not contains UPPERCASE characters', () => {
        const passwordControl = component.loginFormGroup.controls.password;
        passwordControl.setValue('test11!!');
        passwordControl.markAsTouched();

        fixture.detectChanges();

        expect(template.querySelector('.error-wrapper__message').textContent).toEqual(`${FormErrors.PASSWORD_FORMAT} `);
      });
      test('if password not contains LOWERCASE characters', () => {
        const passwordControl = component.loginFormGroup.controls.password;
        passwordControl.setValue('TEST11!!');
        passwordControl.markAsTouched();

        fixture.detectChanges();

        expect(template.querySelector('.error-wrapper__message').textContent).toEqual(`${FormErrors.PASSWORD_FORMAT} `);
      });
      test('if password not contains NUMBERS characters', () => {
        const passwordControl = component.loginFormGroup.controls.password;
        passwordControl.setValue('testTEST!!');
        passwordControl.markAsTouched();

        fixture.detectChanges();

        expect(template.querySelector('.error-wrapper__message').textContent).toEqual(`${FormErrors.PASSWORD_FORMAT} `);
      });
      test('if password not contains SPECIAL characters', () => {
        const passwordControl = component.loginFormGroup.controls.password;
        passwordControl.setValue('test11TEST');
        passwordControl.markAsTouched();

        fixture.detectChanges();

        expect(template.querySelector('.error-wrapper__message').textContent).toEqual(`${FormErrors.PASSWORD_FORMAT} `);
      });

      test('if password is SHORTER tham 8 characters', () => {
        const passwordControl = component.loginFormGroup.controls.password;
        passwordControl.setValue('Test1!');
        passwordControl.markAsTouched();

        fixture.detectChanges();

        expect(template.querySelector('.error-wrapper__message').textContent).toEqual(`${FormErrors.PASSWORD_FORMAT} `);
      });
    });
  });

  describe('Test getEmailInputError()', () => {
    test('should return empty string if input is correct', () => {
      const emailControl = component.loginFormGroup.controls.email;
      emailControl.setValue(correctEmail);
      emailControl.markAsTouched();

      fixture.detectChanges();

      expect(template.querySelector('.error-wrapper__message')).toEqual(null);
    });

    test('should return "Email is required."', () => {
      const emailControl = component.loginFormGroup.controls.email;
      emailControl.setValue('');
      emailControl.markAsTouched();

      fixture.detectChanges();

      expect(template.querySelector('.error-wrapper__message').textContent).toEqual(`${FormErrors.EMAIL_REQUIRED} `);
    });

    test(`should return "${FormErrors.EMAIL_INVALID}" if input not valid`, () => {
      const emailControl = component.loginFormGroup.controls.email;
      emailControl.setValue('test');
      emailControl.markAsTouched();

      fixture.detectChanges();

      expect(template.querySelector('.error-wrapper__message').textContent).toEqual(`${FormErrors.EMAIL_INVALID} `);
    });
  });

  describe('Test shouldDisplayError()', () => {
    test('should return true only if form control is TOUCHED and INVALID', () => {
      const emailControl = component.loginFormGroup.controls.email;
      emailControl.setValue('mark-as-invalid');
      emailControl.markAsTouched();

      fixture.detectChanges();
      const returned = component.shouldDisplayError('email');

      expect(returned).toEqual(true);
    });
    test('should return FALSE if control is TOUCHED and VALID', () => {
      const emailControl = component.loginFormGroup.controls.email;
      emailControl.setValue('valid@email.com');
      emailControl.markAsTouched();

      fixture.detectChanges();
      const returned = component.shouldDisplayError('email');

      expect(returned).toEqual(false);
    });
    test('should return FALSE if control is NOT TOUCHED and VALID', () => {
      const emailControl = component.loginFormGroup.controls.email;
      emailControl.setValue('valid@email.com');
      emailControl.markAsUntouched();

      fixture.detectChanges();
      const returned = component.shouldDisplayError('email');

      expect(returned).toEqual(false);
    });
    test('should return FALSE if control is NOT TOUCHED and INVALID', () => {
      const emailControl = component.loginFormGroup.controls.email;
      emailControl.setValue('mark-as-invalid');
      emailControl.markAsUntouched();

      fixture.detectChanges();
      const returned = component.shouldDisplayError('email');

      expect(returned).toEqual(false);
    });
  });

  describe('Test onLogin()', () => {
    afterEach(() => {
      for (const mockFn of Object.keys(authServiceStub) ) {
        authServiceStub[mockFn].mockClear();
      }
    });

    test('should initiate login process if form is valid', () => {
      const emailControl = component.loginFormGroup.controls.email;
      const passwordControl = component.loginFormGroup.controls.password;
      emailControl.setValue('valid@email.com');
      passwordControl.setValue('validPASSWORD123!');
      emailControl.markAsTouched();
      passwordControl.markAsTouched();

      fixture.detectChanges();
      component.onLogin();

      expect(authServiceStub.setAuthDetails).toBeCalledTimes(1);
      expect(authServiceStub.setAuthDetails).toBeCalledWith(emailControl.value, passwordControl.value);
      expect(authServiceStub.login).toBeCalledTimes(1);
    });

    test('should not initiate login process if form is valid', () => {
      const emailControl = component.loginFormGroup.controls.email;
      const passwordControl = component.loginFormGroup.controls.password;
      emailControl.setValue('invalid-email.com');
      passwordControl.setValue('validPASSWORD123!');
      emailControl.markAsTouched();
      passwordControl.markAsTouched();

      fixture.detectChanges();
      component.onLogin();

      expect(authServiceStub.setAuthDetails).toBeCalledTimes(0);
      expect(authServiceStub.login).toBeCalledTimes(0);
    });
  });
});
