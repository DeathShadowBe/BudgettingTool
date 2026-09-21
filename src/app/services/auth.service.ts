import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  private api = `${environment.apiUrl}/auth/login`;

  constructor(
  private http: HttpClient
  ) {
  }

  login(username: string, password: string): Observable<any> {

    return this.http.post(
      this.api,
      {
      username,
      password
      }
      );
  }

  logout(): void {
    sessionStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem('user') !== null;
  }

  getCurrentUser() {
    const user =
      sessionStorage.getItem('user');

    return user ? JSON.parse(user): null;
  }

  
  updateProfile(profile: any) {
    return this.http.put(
      'https://budgetting-api-f8bpe9hpdxc5f9ec.westeurope-01.azurewebsites.net/api/profile',
      profile
    );
  }

}