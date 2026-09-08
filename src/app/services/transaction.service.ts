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