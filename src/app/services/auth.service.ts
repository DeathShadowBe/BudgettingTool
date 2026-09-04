import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly USERNAME = 'bjorn';
  private readonly PASSWORD = 'test123';

  login(username: string, password: string): boolean {

    if (
      username === this.USERNAME &&
      password === this.PASSWORD
    ) {
      localStorage.setItem('loggedIn', 'true');
      return true;
    }

    return false;
  }

  logout(): void {
    localStorage.removeItem('loggedIn');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('loggedIn') === 'true';
  }
}