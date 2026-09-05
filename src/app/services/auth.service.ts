import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private readonly USERNAME = 'bjorn';
  private readonly PASSWORD = 'test123';

  login(username: string, password: string): boolean {

    const success =
      username === this.USERNAME &&
      password === this.PASSWORD;

    if (success){
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('username',username);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('username');
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(
    'authenticated'
    ) === 'true';
  }

  getUsername(): string {
    return localStorage.getItem('username') ?? '';
  }
}