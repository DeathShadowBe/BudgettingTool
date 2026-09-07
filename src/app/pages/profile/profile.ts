import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './profile.html'
})
export class ProfileComponent {

  profileForm;

  constructor(private fb: FormBuilder,
    private router: Router) {

    this.profileForm = this.fb.group({
      username: [{ value: 'bjorn', disabled: true }],
      email: [
        'bjorn@email.be',
        [Validators.required, Validators.email]
      ],
      naam: [
        'Hauben',
        Validators.required
      ],
      voornaam: [
        'Bjorn',
        Validators.required
      ],
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    });

  }

  save(): void {

    const username = this.profileForm.value;

    localStorage.setItem(
      'username',
      JSON.stringify(username)
    );
  }

  back(): void{
    this.router.navigate(['/']);
  }
}