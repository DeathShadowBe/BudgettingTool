import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {

  username = '';
  password = '';
  error = '';

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