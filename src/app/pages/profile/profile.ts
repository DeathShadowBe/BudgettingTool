import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './profile.html'
})
export class ProfileComponent {

  profileForm;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {

    const user = this.auth.getCurrentUser();

    this.profileForm = this.fb.group({

      username: [
        { value: user?.username ?? '', disabled: true }
      ],
      voornaam: [
        user?.firstName ?? '',
        Validators.required
      ],
      naam: [
        user?.lastName ?? '',
        Validators.required
      ],
      email: [
        user?.email ?? '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']

    });

  }

  save(): void {

  const form = this.profileForm.getRawValue();

  console.log(form);

}

  back(): void{
    this.router.navigate(['/']);
  }
}