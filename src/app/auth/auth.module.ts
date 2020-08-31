import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NewPasswordFormComponent } from './components/new-password-form/new-password-form.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [AuthComponent, LoginFormComponent, NewPasswordFormComponent],
  exports: [AuthComponent]
})
export class AuthModule { }
