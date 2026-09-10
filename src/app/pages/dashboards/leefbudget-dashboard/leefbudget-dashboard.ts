import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { BaseChartDirective } from 'ng2-charts';

import { Transaction } from '../../../models/transaction';
import { TransactionService } from '../../../services/transaction.service';
import { TransactionHelperService } from '../../../services/transaction-helper.service';
import { DashboardConfigService } from '../../../services/dashboard-config.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-leefbudget-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    MatCardModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './leefbudget-dashboard.html',
  styleUrl: './leefbudget-dashboard.scss'
})
export class LeefbudgetDashboardComponent implements OnInit {

  transactions: Transaction[] = [];

  availableMonths: string[] = [];

  selectedMonth = '';

  selectedCategory?: string;

  constructor(
    private auth: AuthService,
    private transactionService: TransactionService,
    private helper: TransactionHelperService,
    public config: DashboardConfigService
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

  get leefuitgaven(): number {

    return this.helper
      .getLeefUitgaven(
        this.monthTransactions
      );

  }

  get verschilLeefbudget(): number {

    return (
      this.config.doelLeefbudget -
      this.leefuitgaven
    );

  }

  get leefbudgetPercentage(): number {

    return (
      this.leefuitgaven /
      this.config.structureelInkomen
    ) * 100;

  }

}