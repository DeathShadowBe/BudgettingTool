import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
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
      ]

    });

  }

  ngOnInit(): void {

  const user =
    this.auth.getCurrentUser();

    this.profileForm.patchValue({

      username: user.username,
      voornaam: user.firstName,
      naam: user.lastName,
      email: user.email

    });

  }

  back(): void{
    this.router.navigate(['/']);
  }

  save(): void {
    const currentUser =
      this.auth.getCurrentUser();

    const form =
      this.profileForm.getRawValue();

    const request = {

      id: currentUser.id,

      email: form.email,

      firstName: form.voornaam,

      lastName: form.naam

    };

    this.auth
        .updateProfile(request)
        .subscribe({

          next: (updatedUser) => {

            localStorage.setItem(
              'user',
              JSON.stringify(updatedUser)
            );

            alert('Profiel opgeslagen');

          },

          error: () => {

            alert(
              'Opslaan mislukt'
            );

          }

        });

  }
}