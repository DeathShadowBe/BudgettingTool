import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

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

  isMobile = false;
  showDetails = false;
  username  = '';
  form!: FormGroup;

  transactions = [
    {
    id: '1',
    datum: '01/09/2026',
    tegenpartij: 'Carrefour'
    },
    {
    id: '2',
    datum: '31/08/2026',
    tegenpartij: 'Q8'
    },
    {
    id: '3',
    datum: '30/08/2026',
    tegenpartij: 'Restaurant'
    }
  ];
  
  constructor(private fb: FormBuilder,
      private auth: AuthService,
      private router: Router) {

    this.checkScreenSize();

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

@HostListener('window:resize')
  onResize(): void {
  this.checkScreenSize();
}
checkScreenSize(): void {
  this.isMobile = window.innerWidth < 768;
  if (!this.isMobile) {
  this.showDetails = true;
}
}
selectTransaction(): void {
  if (this.isMobile) {
    this.showDetails = true;
  }
}
back(): void {
  this.showDetails = false;
}
createNew(): void {
  this.showDetails = true;
}

ngOnInit(): void {
  this.username = this.auth.getUsername();
}

logout(): void {

  this.auth.logout();

  this.router.navigate(
    ['/']
  );

}
}