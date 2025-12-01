import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://dummyjson.com/users';

  private tokenKey = 'token';
  private usernameKey = 'username';
  private emailKey = 'email';
  private photoKey = 'photo';

  constructor(private http: HttpClient) {}

  // Helper to safely check localStorage
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Login
  login(username: string, password: string): Observable<boolean> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        const user = response.users.find(
          (u: any) => u.username === username && u.password === password
        );

        if (user && this.isBrowser()) {
          const fakeToken = btoa(`${username}:${password}`);

          localStorage.setItem(this.tokenKey, fakeToken);
          localStorage.setItem(this.usernameKey, user.username);
          localStorage.setItem(this.emailKey, user.email);
          localStorage.setItem(this.photoKey, user.image);
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  logout() {
    if (!this.isBrowser()) return;

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem(this.emailKey);
    localStorage.removeItem(this.photoKey);
  }

  isLoggedIn(): boolean {
    return this.isBrowser() && !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.tokenKey) : null;
  }

  getUsername(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.usernameKey) : null;
  }

  getEmail(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.emailKey) : null;
  }

  getUserPhoto(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.photoKey) : null;
  }
}
