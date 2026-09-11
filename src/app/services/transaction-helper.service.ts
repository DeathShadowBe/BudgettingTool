import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { DashboardConfigService } from './dashboard-config.service';

@Injectable({
  providedIn: 'root'
})

export class TransactionHelperService {

    constructor(
        private config: DashboardConfigService
        ) {
    }

    private readonly structureleCategorieen = [
        'Wonen',
        'Verzekeringen',
        'Sparen',
        'Nutsvoorzieningen'
        ];

  getCashFlowType(
    transaction: Transaction
  ): string {

    if (transaction.intern) {
      return 'Intern';
    }

    if (transaction.type === 'Inkomst') {
      return 'Inkomsten';
    }

    if (transaction.categorie === 'Sparen') {
      return 'Sparen';
    }

    return 'Uitgaven extern';

  }

  getMaand(
    transaction: Transaction
  ): string {

    const datum =
      new Date(transaction.datum);

    const maand =
      String(
        datum.getMonth() + 1
      ).padStart(2, '0');

    return `${datum.getFullYear()}-${maand}`;

  }

  getTotaleInkomsten(
    transactions: Transaction[]
    ): number {

    return transactions
        .filter(t =>
        t.type === 'Inkomst' &&
        t.categorie === 'Loon'
        )
        .reduce(
        (sum, t) => sum + t.bedrag,
        0
        );

    }

  getTotaleUitgaven(
        transactions: Transaction[]
        ): number {

        return transactions
            .filter(t =>
            t.type === 'Uitgave'
            )
            .reduce(
            (sum, t) => sum + t.bedrag,
            0
            );

        }

    getStructureleUitgaven(
    transactions: Transaction[]
    ): number {

    return transactions
        .filter(t =>
        t.type === 'Uitgave' &&
        this.structureleCategorieen.includes(
            t.categorie
        )
        )
        .reduce(
        (sum, t) => sum + t.bedrag,
        0
        );

    }

    getOperationeleUitgaven(
    transactions: Transaction[]
    ): number {

    return transactions
        .filter(t =>
        t.type === 'Uitgave' &&
        !t.intern &&
        !this.structureleCategorieen.includes(
            t.categorie
        )
        )
        .reduce(
        (sum, t) => sum + t.bedrag,
        0
        );

    }

    getLeefUitgaven(
    transactions: Transaction[]
    ): number {

    return transactions
        .filter(t =>
        t.type === 'Uitgave' &&
        !t.project &&
        !t.intern &&
        !this.structureleCategorieen.includes(
            t.categorie
        )
        )
        .reduce(
        (sum, t) => sum + t.bedrag,
        0
        );

    }

    getLeefBudgetPercentage(
    transactions: Transaction[]
    ): number {

    return (this.getLeefUitgaven(
        transactions
    ) / this.config.structureelInkomen) * 100;

    }

    getLeefBudgetBedrag(
  transactions: Transaction[]
): number {

  return transactions.reduce(
    (sum, transaction) => {

      return sum +
        (
          transaction.type === 'Uitgave'
            ? Math.abs(
                transaction.bedrag
              )
            : transaction.bedrag
        );

    },
    0
  );

}

    getLeefBudgetVerschil(
    transactions: Transaction[]
    ): number {

    return (
        this.config.doelLeefbudget -
        this.getLeefUitgaven(
        transactions
        )
    );

    }

    getLeefBudgetKleur(
    transactions: Transaction[]
    ): string {

    const pct =
        this.getLeefBudgetPercentage(
        transactions
        );

    if (
        pct <=
        this.config.leefbudgetPct * 100
    ) {
        return '#2E7D32';
    }

    if (
        pct <=
        this.config.waarschuwingsGrens * 100
    ) {
        return '#F9A825';
    }

    return '#C62828';

    }

    getVrijeRuimteNaStructuur(
    transactions: Transaction[]
    ): number {

    return (
        this.getGemiddeldeMaandInkomsten(
        transactions
        ) -
        this.getStructureleMaandlasten(
        transactions
        )
    );

    }

    private getMonthGroups(
    transactions: Transaction[]
    ): Map<string, Transaction[]> {

    const map = new Map<string, Transaction[]>();

    transactions.forEach(transaction => {

        const date =
        new Date(transaction.datum);

        const maand =
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!map.has(maand)) {

        map.set(maand, []);

        }

        map.get(maand)?.push(transaction);

    });

    return map;

    }

    getGemiddeldeMaandInkomsten(
    transactions: Transaction[]
    ): number {

    const groups =
        [...this.getMonthGroups(transactions).values()];

    const months =
        groups.slice(
        -this.config.xMaanden
        );

    const totals =
        months.map(month =>
        this.getTotaleInkomsten(month)
        );

    return totals.length
        ? totals.reduce((a, b) => a + b, 0)
            / totals.length
        : 0;

    }

    getGemiddeldeUitgaven(
    transactions: Transaction[]
    ): number {

    const groups =
        [...this.getMonthGroups(transactions).values()];

    const months =
        groups.slice(
        -this.config.xMaanden
        );

    const totals =
        months.map(month =>
        this.getTotaleUitgaven(month)
        );

    return totals.length
        ? totals.reduce((a, b) => a + b, 0)
            / totals.length
        : 0;

    }

    getStructureleMaandlasten(
    transactions: Transaction[]
    ): number {

    const groups =
        [...this.getMonthGroups(transactions).values()];

    const months =
        groups.slice(
        -this.config.xMaanden
        );

    const totals =
        months.map(month =>
        this.getStructureleUitgaven(month)
        );

    return totals.length
        ? totals.reduce((a, b) => a + b, 0)
            / totals.length
        : 0;

    }

    getLeefruimte(
    transactions: Transaction[]
    ): number {

    return (
        this.getGemiddeldeMaandInkomsten(
        transactions
        ) -
        this.getStructureleMaandlasten(
        transactions
        ) -
        this.getGemiddeldeLeefuitgaven(
        transactions
        )
    );

    }

    getGemiddeldeLeefuitgaven(
    transactions: Transaction[]
    ): number {

    const groups =
        [...this.getMonthGroups(transactions).values()];

    const months =
        groups.slice(
        -this.config.xMaanden
        );

    const totals =
        months.map(month =>
        this.getLeefUitgaven(month)
        );

    return totals.length
        ? totals.reduce((a, b) => a + b, 0)
            / totals.length
        : 0;

    }

    getLeefruimteRatio(
    transactions: Transaction[]
    ): number {

    return (
        this.getGemiddeldeLeefuitgaven(
        transactions
        ) /
        this.getVrijeRuimteNaStructuur(
        transactions
        )
    );

    }

    getAandeelStructureleLasten(
    transactions: Transaction[]
    ): number {

    return (
        this.getStructureleMaandlasten(
        transactions
        ) /
        this.getGemiddeldeMaandInkomsten(
        transactions
        )
    );

    }

    getActieveDomeinen(
    transactions: Transaction[]
    ): number {

    const categorieen =
        new Set(
        transactions.map(
            x => x.categorie
        )
        );

    return categorieen.size;

    }

    getNettoCashflow(
    transactions: Transaction[]
    ): number {

    return transactions.reduce(
        (sum, transaction) =>
        sum +
        this.getSignedAmount(
            transaction
        ),
        0
    );

    }


    private average(
    values: number[]
    ): number {

    return values.reduce(
        (a, b) => a + b,
        0
    ) / values.length;

    }

    private standardDeviation(
    values: number[]
    ): number {

    const avg =
        this.average(values);

    const squareDiffs =
        values.map(v =>
        Math.pow(
            v - avg,
            2
        )
        );

    return Math.sqrt(
        this.average(squareDiffs)
    );

    }

    private median(
    values: number[]
    ): number {

    if (!values.length) {
        return 0;
    }

    const sorted =
        [...values].sort(
        (a, b) => a - b
        );

    const middle =
        Math.floor(
        sorted.length / 2
        );

    return sorted.length % 2 === 0
        ? (
            sorted[middle - 1] +
            sorted[middle]
        ) / 2
        : sorted[middle];

    }

    getCashflowInkomsten(
    transactions: Transaction[]
    ): number {

    return transactions
        .filter(t =>
        this.getCashFlowType(t) ===
        'Inkomsten'
        )
        .reduce(
        (sum, t) => sum + t.bedrag,
        0
        );

    }

    getCashflowSparen(
    transactions: Transaction[]
    ): number {

    return transactions
        .filter(t =>
        this.getCashFlowType(t) ===
        'Sparen'
        )
        .reduce(
        (sum, t) => -sum - t.bedrag,
        0
        );

    }

    getCashflowUitgavenExtern(
    transactions: Transaction[]
    ): number {

    return transactions
        .filter(t =>
        this.getCashFlowType(t) ===
        'Uitgaven extern'
        )
        .reduce(
        (sum, t) => sum - t.bedrag,
        0
        );

    }

    getSignedAmount(
    transaction: Transaction
    ): number {

    const type =
        this.getCashFlowType(
        transaction
        );

    switch(type) {

        case 'Inkomsten':
        return transaction.bedrag;

        case 'Sparen':
        return -transaction.bedrag;

        case 'Uitgaven extern':
        return -transaction.bedrag;

        case 'Intern':
        return 0;

        default:
        return 0;

    }

    }

    getStandaardafwijkingMaanduitgaven(
    transactions: Transaction[]
    ): number {

    const groups =
        [...this.getMonthGroups(
        transactions
        ).values()];

    const months =
        groups.slice(
        -this.config.xMaanden
        );

    const leefuitgaven =
        months.map(month =>
        this.getLeefUitgaven(
            month
        )
        );

    return this.standardDeviation(
        leefuitgaven
    );

    }

    getVariatieStructureleMaandlasten(
    transactions: Transaction[]
    ): number {

    const groups =
        [...this.getMonthGroups(
        transactions
        ).values()];

    const months =
        groups.slice(
        -this.config.xMaanden
        );

    const waarden =
        months.map(month =>
        this.getTotaleUitgaven(
            month
        )
        );

    return this.standardDeviation(
        waarden
    );

    }

    getTypischeMaand(
    transactions: Transaction[]
    ): number {

    const groups =
        [...this.getMonthGroups(
        transactions
        ).values()];

    const months =
        groups.slice(
        -this.config.xMaanden
        );

    const totalen =
        months.map(month =>
        this.getTotaleUitgaven(
            month
        )
        );

    return this.median(
        totalen
    );

    }

    getMaandVariatie(
    transactions: Transaction[]
    ): number {

    const groups =
        [...this.getMonthGroups(
        transactions
        ).values()];

    const months =
        groups.slice(
        -this.config.xMaanden
        );

    const totalen =
        months.map(month =>
        this.getTotaleUitgaven(
            month
        )
        );

    const gemiddelde =
        this.average(
        totalen
        );

    if (
        gemiddelde === 0
    ) {
        return 0;
    }

    return (
        this.standardDeviation(
        totalen
        ) /
        gemiddelde
    );

    }
}

