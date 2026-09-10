import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

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
    BaseChartDirective,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './leefbudget-dashboard.html',
  styleUrl: './leefbudget-dashboard.scss'
})
export class LeefbudgetDashboardComponent implements OnInit {

  transactions: Transaction[] = [];

  availableMonths: string[] = [];

  selectedMonth = '';

  selectedCategory?: string;

  categoryChartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false
      }

    },

    scales: {

      y: {

        beginAtZero: true,

        max: 100

      }

    }

  };

  gaugeOptions = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false
      },

      tooltip: {
        enabled: false
      }

    },

    cutout: '70%'

  };

  categorieColumns = [
    'categorie',
    'bedrag',
    'percentage'
  ];

  detailColumns = [
    'bedrag',
    'categorie',
    'tegenpartij',
    'opmerking',
    'project'
  ];

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
  
  get gaugeData() {
    return {

      datasets: [
        {
          data: [
            this.leefbudgetPercentage,
            100 -
              this.leefbudgetPercentage
          ],

          backgroundColor: [
            this.helper
              .getLeefBudgetKleur(
                this.monthTransactions
              ),

            '#E0E0E0'
          ]
        }
      ]

    };

  }

  get categorieOverzicht() {

    const result: Record<string, number> = {};

    this.monthTransactions
      .forEach(transaction => {

        if (!result[transaction.categorie]) {

          result[transaction.categorie] = 0;

        }

        result[transaction.categorie] +=
          transaction.bedrag;

      });

    return Object
      .entries(result)
      .map(x => ({

        categorie: x[0],

        bedrag: x[1],

        percentage:
          this.leefuitgaven === 0
            ? 0
            : (x[1] / this.leefuitgaven) * 100

      }))
      .sort(
        (a, b) => b.bedrag - a.bedrag
      );

  }

  get categoryChartData() {

    return {

      labels:
        this.categorieOverzicht
          .map(x => x.categorie),

      datasets: [

        {

          label:
            'Leefbudget %',

          data:
            this.categorieOverzicht
              .map(
                x => x.percentage
              ),

          backgroundColor:
            '#4CAF50'

        }

      ]

    };

  }

  get leefbudgetKleur(): string {
    if (
      this.leefbudgetPercentage <=
      this.config.leefbudgetPct * 100
    ) {
      return '#2E7D32';
    }

    if (
      this.leefbudgetPercentage <=
      this.config.waarschuwingsGrens * 100
    ) {
      return '#F9A825';
    }

    return '#C62828';

  }

  get detailTransactions(): Transaction[] {

    let result = this.monthTransactions
      .filter(t =>
        !t.project &&
        t.type === 'Uitgave' &&
        !t.intern
      );

    if (this.selectedCategory) {

      result = result.filter(t =>
        t.categorie ===
        this.selectedCategory
      );

    }

    return result.sort(
      (a, b) =>
        b.bedrag - a.bedrag
    );

  }

}