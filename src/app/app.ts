import { Component } from '@angular/core';
import { TransactionsComponent } from './pages/transactions/transactions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TransactionsComponent],
  template: '<app-transactions></app-transactions>'
})
export class AppComponent {
}