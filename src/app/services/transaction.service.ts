import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Transaction } from '../models/transaction';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient
  ) {}

  getTransactions(
    userId: string
  ) {

    return this.http.get<Transaction[]>(
      `${this.apiUrl}/transactions/${userId}`
    );

  }

  importTransactions(
    file: File,
    userId: string
  ): Observable<any> {

    const formData = new FormData();

    formData.append('file',file);
    formData.append('userId', userId);

    return this.http.post(
      `${this.apiUrl}/transactions/import`,
      formData
    );

  }

  createTransaction(
    transaction: Transaction
  ) {

    return this.http.post(
      `${this.apiUrl}/transactions`,
      transaction
    );
  }
}