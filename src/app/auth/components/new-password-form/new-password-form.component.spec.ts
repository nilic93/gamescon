import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasswordFormComponent } from './new-password-form.component';
import { AuthService } from '../../auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { authServiceStub } from '../../../shared/mocks/auth-service-stub/auth.service.stub';
import { FormErrors } from './../../../shared/enums/form-errors/form-errors.enum';

describe('NewPasswordFormComponent', () => {
  let component: NewPasswordFormComponent;
  let fixture: ComponentFixture<NewPasswordFormComponent>;
  let correctPassword: string;
  let template: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [NewPasswordFormComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceStub,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPasswordFormComponent);
    component = fixture.componentInstance;
    correctPassword = 'testTEST11!!';
    template = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test getFormInputError()', () => {
    describe('Test new password field errors', () => {
      test('should return empty string if input is correct', () => {
        const newPasswordControl = component.newPasswordFormGroup.controls.newPassword;
        newPasswordControl.setValue(correctPassword);
        newPasswordControl.markAsTouched();

        fixture.detectChanges();

        expect(template.querySelector('.error-wrapper__message')).toEqual(null);
      });

      test(`should return ${FormErrors.NEW_PASSWORD_REQUIRED} if password not inputed`, () => {
        const newPasswordControl = component.newPasswordFormGroup.controls.newPassword;
        newPasswordControl.setValue('');
        newPasswordControl.markAsTouched();

        fixture.detectChanges();

        expect(template.querySelector('.error-wrapper__message').textContent).toEqual(
          `${FormErrors.NEW_PASSWORD_REQUIRED} `
        );
      });

      describe('Test return password format error message', () => {
        test('if password not contains UPPERCASE characters', () => {
          const newPasswordControl = component.newPasswordFormGroup.controls.newPassword;
          newPasswordControl.setValue('test11!!');
          newPasswordControl.markAsTouched();

          fixture.detectChanges();

          expect(template.querySelector('.error-wrapper__message').textContent).toEqual(
            `${FormErrors.PASSWORD_FORMAT} `
          );
        });
        test('if password not contains LOWERCASE characters', () => {
          const newPasswordControl = component.newPasswordFormGroup.controls.newPassword;
          newPasswordControl.setValue('TEST11!!');
          newPasswordControl.markAsTouched();

          fixture.detectChanges();

          expect(template.querySelector('.error-wrapper__message').textContent).toEqual(
            `${FormErrors.PASSWORD_FORMAT} `
          );
        });
        test('if password not contains NUMBERS characters', () => {
          const newPasswordControl = component.newPasswordFormGroup.controls.newPassword;
          newPasswordControl.setValue('testTEST!!');
          newPasswordControl.markAsTouched();

          fixture.detectChanges();

          expect(template.querySelector('.error-wrapper__message').textContent).toEqual(
            `${FormErrors.PASSWORD_FORMAT} `
          );
        });
        test('if password not contains SPECIAL characters', () => {
          const newPasswordControl = component.newPasswordFormGroup.controls.newPassword;
          newPasswordControl.setValue('test11TEST');
          newPasswordControl.markAsTouched();

          fixture.detectChanges();

          expect(template.querySelector('.error-wrapper__message').textContent).toEqual(
            `${FormErrors.PASSWORD_FORMAT} `
          );
        });

        test('if password is SHORTER tham 8 characters', () => {
          const newPasswordControl = component.newPasswordFormGroup.controls.newPassword;
          newPasswordControl.setValue('Test1!');
          newPasswordControl.markAsTouched();

          fixture.detectChanges();

          expect(template.querySelector('.error-wrapper__message').textContent).toEqual(
            `${FormErrors.PASSWORD_FORMAT} `
          );
        });
      });

      test('should return password match error if passwords not match', () => {
        const newPasswordControl = component.newPasswordFormGroup.controls.newPassword;
        newPasswordControl.setValue('missmatch' + correctPassword);
        newPasswordControl.markAsTouched();

        const confirmPasswordControl = component.newPasswordFormGroup.controls.confirmPassword;
        confirmPasswordControl.setValue(correctPassword);
        confirmPasswordControl.markAsTouched();

        fixture.detectChanges();

        expect(template.querySelector('.error-wrapper__message').textContent).toEqual(`${FormErrors.PASSWORD_MATCH} `);
      });
    });
  });

  describe('Test shouldDisplayInputError()', () => {
    test('should return true only if form control is TOUCHED and INVALID', () => {
      const newPassword = component.newPasswordFormGroup.controls.newPassword;
      newPassword.setValue('mark-as-invalid');
      newPassword.markAsTouched();

      fixture.detectChanges();
      const returned = component.shouldDisplayInputError('newPassword');

      expect(returned).toEqual(true);
    });
    test('should return FALSE if control is TOUCHED and VALID', () => {
      const newPassword = component.newPasswordFormGroup.controls.newPassword;
      newPassword.setValue(correctPassword);
      newPassword.markAsTouched();

      fixture.detectChanges();
      const returned = component.shouldDisplayInputError('newPassword');

      expect(returned).toEqual(false);
    });
    test('should return FALSE if control is NOT TOUCHED and VALID', () => {
      const newPassword = component.newPasswordFormGroup.controls.newPassword;
      newPassword.setValue(correctPassword);
      newPassword.markAsUntouched();

      fixture.detectChanges();
      const returned = component.shouldDisplayInputError('newPassword');

      expect(returned).toEqual(false);
    });
    test('should return FALSE if control is NOT TOUCHED and INVALID', () => {
      const newPassword = component.newPasswordFormGroup.controls.newPassword;
      newPassword.setValue('mark-as-invalid');
      newPassword.markAsUntouched();

      fixture.detectChanges();
      const returned = component.shouldDisplayInputError('newPassword');

      expect(returned).toEqual(false);
    });
  });

  describe('Test onNewPasswordInputed()', () => {
    afterEach(() => {
      for (const mockFn of Object.keys(authServiceStub)) {
        authServiceStub[mockFn].mockClear();
      }
    });

    test('should initiate login process if form is valid', () => {
      const newPasswordControl = component.newPasswordFormGroup.controls.newPassword;
      newPasswordControl.setValue(correctPassword);
      newPasswordControl.markAsTouched();

      const confirmPasswordControl = component.newPasswordFormGroup.controls.confirmPassword;
      confirmPasswordControl.setValue(correctPassword);
      confirmPasswordControl.markAsTouched();

      fixture.detectChanges();
      component.onNewPasswordInputed();

      expect(authServiceStub.setNewPassword).toBeCalledTimes(1);
      expect(authServiceStub.setNewPassword).toBeCalledWith(newPasswordControl.value);
      expect(authServiceStub.login).toBeCalledTimes(1);
    });

    test('should not initiate login process if form is not valid', () => {
      const newPasswordControl = component.newPasswordFormGroup.controls.newPassword;
      newPasswordControl.setValue('mark-as-invalid');
      newPasswordControl.markAsTouched();

      const confirmPasswordControl = component.newPasswordFormGroup.controls.confirmPassword;
      confirmPasswordControl.setValue(correctPassword);
      confirmPasswordControl.markAsTouched();

      fixture.detectChanges();
      component.onNewPasswordInputed();

      expect(authServiceStub.setNewPassword).toBeCalledTimes(0);
      expect(authServiceStub.login).toBeCalledTimes(0);
    });
  });

  describe('Test shouldDisplayPasswordMatchError()', () => {
    let newPasswordControl, confirmPasswordControl;
    beforeEach(() => {
      newPasswordControl = component.newPasswordFormGroup.controls.newPassword;
      newPasswordControl.markAsTouched();
      confirmPasswordControl = component.newPasswordFormGroup.controls.confirmPassword;
      confirmPasswordControl.markAsTouched();
    });

    test('should return TRUE only if confirm password field HAS "passwordMatch" error \
    and new password field has NOT "required" error', () => {
      newPasswordControl.setValue('not-empty-string');
      confirmPasswordControl.setValue('aa11AA!!');

      fixture.detectChanges();
      const returned = component.shouldDisplayPasswordMatchError();

      expect(returned).toEqual(true);
    });

    test('should return FALSE if confirm HAS match error and new password HAS required error', () => {
      newPasswordControl.setValue('');
      confirmPasswordControl.setValue(correctPassword);
      confirmPasswordControl.setErrors({ passwordMatch: true });

      fixture.detectChanges();
      const returned = component.shouldDisplayPasswordMatchError();

      expect(returned).toEqual(false);
    });

    test('should return FALSE if confirm has NOT match error and new password has not required error', () => {
      newPasswordControl.setValue(correctPassword);
      confirmPasswordControl.setValue(correctPassword);
      confirmPasswordControl.setErrors(null);

      fixture.detectChanges();
      const returned = component.shouldDisplayPasswordMatchError();

      expect(returned).toEqual(false);
    });
  });
});
