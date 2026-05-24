import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { User, LoginRequest, LoginResponse, AuthState } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'nd_token';
  private readonly USER_KEY = 'nd_user';

  private authState = new BehaviorSubject<AuthState>({
    user: this.getSavedUser(),
    token: this.getSavedToken(),
    isAuthenticated: !!this.getSavedToken(),
    isLoading: false,
    error: null,
  });

  authState$ = this.authState.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  get currentUser(): User | null {
    return this.authState.value.user;
  }

  get token(): string | null {
    return this.authState.value.token;
  }

  get isAuthenticated(): boolean {
    return this.authState.value.isAuthenticated;
  }

  get isAdmin(): boolean {
    return this.authState.value.user?.role === 'Admin';
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.setLoading(true);
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.success) {
            this.setSession(response.data.token, response.data.user);
          }
          this.setLoading(false);
        }),
        catchError((err) => {
          this.setLoading(false);
          this.setError(err.error?.message || 'Login failed. Please try again.');
          return throwError(() => err);
        })
      );
  }

  logout(): void {
    this.http
      .post(`${environment.apiUrl}/auth/logout`, {})
      .subscribe({ error: () => {} });
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  refreshProfile(): Observable<{ success: boolean; data: { user: User } }> {
    return this.http
      .get<{ success: boolean; data: { user: User } }>(
        `${environment.apiUrl}/auth/profile`
      )
      .pipe(
        tap((response) => {
          if (response.success) {
            this.updateUser(response.data.user);
          }
        })
      );
  }

  clearError(): void {
    this.authState.next({ ...this.authState.value, error: null });
  }

  private setSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.authState.next({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.authState.next({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }

  private updateUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.authState.next({ ...this.authState.value, user });
  }

  private setLoading(isLoading: boolean): void {
    this.authState.next({ ...this.authState.value, isLoading });
  }

  private setError(error: string): void {
    this.authState.next({ ...this.authState.value, error, isLoading: false });
  }

  private getSavedToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getSavedUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
