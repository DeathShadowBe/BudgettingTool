import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,

    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayoutComponent {

  constructor(
    private auth: AuthService
  ) {
  }

  get user() {

    return this.auth.getCurrentUser();

  }

  get avatarLetter(): string {

    return this.user?.firstName?.charAt(0)
      ?.toUpperCase() ?? '?';

  }

}