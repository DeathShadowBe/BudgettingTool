import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { BaseChartDirective } from 'ng2-charts';

import { Transaction } from '../../../models/transaction';
import { AuthService } from '../../../services/auth.service';
import { TransactionService } from '../../../services/transaction.service';
import { TransactionHelperService } from '../../../services/transaction-helper.service';

@Component({
  selector: 'app-cashflow-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    BaseChartDirective
  ],
  templateUrl: './cashflow-dashboard.html',
  styleUrl: './cashflow-dashboard.scss'
})
export class CashflowDashboardComponent implements OnInit {

  transactions: Transaction[] = [];

  availableMonths: string[] = [];

  selectedMonth = '';

  detailColumns = [
    'datum',
    'categorie',
    'rekening',
    'tegenpartij',
    'opmerking',
    'cashflow',
    'cashflowType',
    'project'
  ];

  cashflowChartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false
      }

    }

  };

  constructor(
    private auth: AuthService,
    private transactionService: TransactionService,
    private helper: TransactionHelperService
  ) {
  }

  ngOnInit(): void {

    const user =
      this.auth.getCurrentUser();

    this.transactionService
      .getTransactions(user.id)
      .subscribe({

        next: transactions => {

          this.transactions =
            transactions;

          this.availableMonths =
            [...new Set(
              transactions.map(
                t => this.helper.getMaand(t)
              )
            )]
            .sort()
            .reverse();

          this.selectedMonth =
            this.availableMonths[0];

        }

      });

  }

  get monthTransactions(): Transaction[] {

    return this.transactions.filter(
      t =>
        this.helper.getMaand(t) ===
        this.selectedMonth
    );

  }

  get nettoCashflow(): number {

    return this.helper
      .getNettoCashflow(
        this.monthTransactions
      );

  }

  get cashflowInkomsten(): number {

    return this.helper
      .getCashflowInkomsten(
        this.monthTransactions
      );

  }

  get cashflowUitgavenExtern(): number {

    return this.helper
      .getCashflowUitgavenExtern(
        this.monthTransactions
      );

  }

  get cashflowSparen(): number {

    return this.helper
      .getCashflowSparen(
        this.monthTransactions
      );

  }

  get cashflowChartData() {

    return {

      labels: [
        this.selectedMonth
      ],

      datasets: [

        {
          label: 'Inkomsten',
          backgroundColor: '#4a86e8',
          data: [
            this.cashflowInkomsten
          ]
        },

        {
          label: 'Sparen',
          backgroundColor: '#1a237e',
          data: [
            this.cashflowSparen
          ]
        },

        {
          label: 'Uitgaven extern',
          backgroundColor: '#d97745',
          data: [
            this.cashflowUitgavenExtern
          ]
        }

      ]

    };

  }

  get detailTransactions() {

    return this.monthTransactions
      .map(t => ({

        ...t,

        cashflow:
          this.helper
            .getSignedAmount(t),

        cashflowType:
          this.helper
            .getCashFlowType(t)

      }))
      .sort(
        (a, b) =>
          new Date(b.datum).getTime()
          -
          new Date(a.datum).getTime()
      );

  }

}