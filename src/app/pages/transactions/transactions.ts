import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class TransactionsComponent {

  form!: FormGroup;

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      datum: [''],
      tegenpartij: [''],
      bedrag: [''],
      categorie: [''],
      rekening: [''],
      opmerking: [''],
      type: [''],
      project: [false],
      intern: [false],
      id: ['']
    });
}

profileName = '';

ngOnInit(): void {

  const profile = localStorage.getItem('profile');

  if (profile) {
    this.profileName =
      JSON.parse(profile).name;
  }

}
}