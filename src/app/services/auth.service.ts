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
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('user') !== null;
  }

  getCurrentUser() {
    const user =
      localStorage.getItem('user');

    return user ? JSON.parse(user): null;
  }

}