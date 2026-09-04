import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  error = '';
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  login(): void {

  if (this.loginForm.invalid) {
    return;
  }

  const username = this.loginForm.value.username;
  const password = this.loginForm.value.password;

  const success = this.auth.login(
    username,
    password
  );

  if (success) {

    this.router.navigate(['/transactions']);

  } else {

    this.error = 'Ongeldige login';

  }

}
}