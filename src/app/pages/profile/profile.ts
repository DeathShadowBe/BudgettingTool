import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIcon, MatToolbar, MatMenuModule, MatDivider],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent {

  profileForm;
  user: any;

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

  openProfile(): void {
    this.router.navigate(['/profile']);
  }

  openTransactions(): void {
    this.router.navigate(['/']);
  }

  openDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  openCashflowDashboard(): void {
      this.router.navigate(['/dashboard/cashflow']);
  }

  get avatarLetter(): string {
    const avatarLetter = this.auth.getCurrentUser()?.username?.charAt(0)?.toUpperCase() ?? '?';
    return avatarLetter;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}