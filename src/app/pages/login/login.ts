import { Component } from '@angular/core';
import { FormsModule,ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {

  username = '';
  password = '';
  error = '';
  loginForm!: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login(): void {

    const success = this.auth.login(
      this.username,
      this.password
    );

    if (success) {
      this.router.navigate(['/transactions']);
    } else {
      this.error = 'Ongeldige login';
    }
  }
}