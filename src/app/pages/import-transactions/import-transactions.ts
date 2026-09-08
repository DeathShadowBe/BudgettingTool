import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-import-transactions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './import-transactions.html',
  styleUrls: ['./import-transactions.scss']
})
export class ImportTransactionsComponent {

  selectedFile?: File;

  uploading = false;

  constructor(
    private transactionService: TransactionService,
    private auth: AuthService
  ) {
  }

  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (
      input.files &&
      input.files.length > 0
    ) {

      this.selectedFile =
        input.files[0];

    }
  }

  importCsv(): void {

    const user = this.auth.getCurrentUser();

    if (!this.selectedFile) {

      alert(
        'Selecteer eerst een CSV bestand'
      );

      return;
    }

    this.uploading = true;

    this.transactionService
      .importTransactions(
        this.selectedFile,
        user.id
      )
      .subscribe({

        next: () => {

          this.uploading = false;

          alert(
            'Import succesvol'
          );

        },

        error: (error) => {

          console.error(error);

          this.uploading = false;

          alert(
            'Import mislukt'
          );

        }

      });

  }

}