import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl =
    'https://budgetting-api-f8bpe9hpdxc5f9ec.westeurope-01.azurewebsites.net/api';

  constructor(
    private http: HttpClient
  ) {}

  getTransactions(): Observable<Transaction[]> {

    return this.http.get<Transaction[]>(
      `${this.apiUrl}/transactions`
    );

  }

  importTransactions(
    file: File
  ): Observable<any> {

    const formData = new FormData();

    formData.append(
      'file',
      file
    );

    return this.http.post(
      `${this.apiUrl}/transactions/import`,
      formData
    );

  }

}