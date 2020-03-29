import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  username = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  repeatedPassword = new FormControl('', Validators.required);

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      username: this.username,
      email: this.email,
      password: this.password,
      repeatedPassword: this.repeatedPassword,
    });
  }

  onSubmit() {
    console.log('model-based form submitted');
    console.log(this.form);
    console.log(this.form.value.firstName);
  }

  ngOnInit(): void {
  }

}
