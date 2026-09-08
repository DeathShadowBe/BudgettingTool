import { Component } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-import-transactions',
  templateUrl: './import-transactions.html',
  styleUrls: ['./import-transactions.css']
})
export class ImportTransactionsComponent {

  selectedFile?: File;

  uploading = false;

  constructor(
    private transactionService: TransactionService
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

    if (!this.selectedFile) {

      alert(
        'Selecteer eerst een CSV bestand'
      );

      return;
    }

    this.uploading = true;

    this.transactionService
      .importTransactions(
        this.selectedFile
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