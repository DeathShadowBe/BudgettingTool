import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class TransactionsComponent {

  isMobile = false;
  showDetails = false;
  username  = '';
  form!: FormGroup;
  mode: 'view' | 'edit' | 'new' = 'view';
  selectedTransaction: TransactionsComponent | null = null;
  searchText = '';
  pageSize = 25;
  pageIndex = 0;

  rekeningen = [
    'Prive',
    'VISA',
    'Gezamelijk'
  ];

  categorieen = [
    'Boodschappen',
    'Loon',
    'Wonen',
    'Verzekeringen',
    'Shopping',
    'Sparen',
    'Vrije Tijd',
    'Diensten',
    'Nutsvoorzieningen',
    'Zorg en Welzijn',
    'Bar & Resto',
    'Terugbetaling',
    'Andere',
    'Eigen Rekening',
    'Overheid',
    'Huur',
    'Financieel',
    'Mobiliteit',
    'Onderwijs',
    'Dividend',
    'Cash',
    'Inkomst'
  ];

  types = [
    'Inkomst',
    'Uitgave',
    'Opbouw',
    'Terugname'
  ];

  
  constructor(private fb: FormBuilder,
      private auth: AuthService,
      private router: Router,
      private transactionService: TransactionService) {

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
transactions: Transaction[] = [];

ngOnInit(): void {
  this.loadTransactions();
}

loadTransactions(): void {
  const user =
    this.auth.getCurrentUser();

  this.transactionService
      .getTransactions(user.id)
      .subscribe({

        next: (transactions) => {

          console.log(transactions);

          this.transactions =
            transactions;

        },

        error: (error) => {

          console.error(error);

        }

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
selectTransaction(transaction: TransactionsComponent): void {
  if (this.isMobile) {
    this.showDetails = true;
  }
  this.selectedTransaction = transaction;
  this.mode = 'view';
  this.updateFormMode();
  setTimeout(() => {
    this.form.patchValue(transaction);
  });
}
createNew(): void {
  this.showDetails = true;
  this.selectedTransaction = null;
  this.mode = 'new';
  this.updateFormMode();
  this.form.reset();
}

logout(): void {
  this.auth.logout();
  this.router.navigate(['/']);
}

edit(): void {
  this.mode = 'edit';
  this.updateFormMode();
}

cancel(): void {
  if (this.isMobile) {
    this.showDetails = false;
  }
  this.mode = 'view';
  this.updateFormMode();
  this.selectedTransaction = null;
  this.form.reset();
}

submit(): void {

  if (this.form.invalid) {
    return;
  }

  this.mode = 'view';
  this.updateFormMode();
}

get filteredTransactions() {
  if (!this.searchText) {
    return this.transactions;
  }

  const search =
    this.searchText.toLowerCase();

  return this.transactions.filter(t =>
      t.tegenpartij?.toLowerCase()
          .includes(search) ||
      t.categorie?.toLowerCase()
          .includes(search) ||
      t.opmerking?.toLowerCase()
          .includes(search)
  );
}

get pagedTransactions() {

  const start =
    this.pageIndex * this.pageSize;

  return this.filteredTransactions.slice(
    start,
    start + this.pageSize
  );
}

openProfile(): void {
  this.router.navigate(['/profile']);
}

importTransactions(): void {
  this.router.navigate(['/import']);
}

updateFormMode(): void {

  const controls = [
    'datum',
    'rekening',
    'categorie',
    'type',
    'bedrag',
    'tegenpartij',
    'opmerking',
    'project',
    'intern'
  ];

  if (this.mode === 'view') {

    controls.forEach(control =>
      this.form.get(control)?.disable()
    );

  } else {

    controls.forEach(control =>
      this.form.get(control)?.enable()
    );

  }

}

get avatarLetter(): string {
  const avatarLetter = this.auth.getCurrentUser()?.username?.charAt(0)?.toUpperCase() ?? '?';
  return avatarLetter;
}

}