import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './profile.html'
})
export class ProfileComponent {

  profileForm;

  constructor(private fb: FormBuilder) {

    this.profileForm = this.fb.group({
      name: ['Bjorn Hauben']
    });

  }

  save(): void {

    const profile = this.profileForm.value;

    localStorage.setItem(
      'profile',
      JSON.stringify(profile)
    );

    console.log('saved', profile);

  }

}