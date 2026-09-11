import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatIcon,
    MatDivider
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayoutComponent {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  get user() {

    return this.auth.getCurrentUser();

  }

  get avatarLetter(): string {

    return this.user?.firstName?.charAt(0)
      ?.toUpperCase() ?? '?';

  }

  openProfile(): void {
    this.router.navigate(['/profile']);
  }

  openDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  openCashflowDashboard(): void {
    this.router.navigate(['/dashboard/cashflow']);
  }

  openTransactions(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}