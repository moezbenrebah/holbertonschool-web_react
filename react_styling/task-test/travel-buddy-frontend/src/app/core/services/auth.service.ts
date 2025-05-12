import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getCurrentUser() {
    throw new Error('Method not implemented.');
  }
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('token'); // Changed from 'authToken' to 'token'
  }

  // Manually log in (for non-Auth0 login)
  loginWithCredentials(credentials: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token); // Changed from 'authToken' to 'token'
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token'); // Clear token on logout
    this.isAuthenticatedSubject.next(false);
  }

  updateUserProfile(data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/auth/profile`, data);
  }

  // Add these methods for ProfileComponent
  getUser(): Observable<any> {
    // Assuming you store user info in localStorage or you can fetch it from API
    const token = this.getToken();
    if (!token) {
      return of(null);
    }
    
    // You can either decode the token to get user info or make an API call
    // For now, let's make an API call to get current user's profile
    return this.http.get(`${environment.apiUrl}/auth/me`);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): Observable<boolean> {
    // Return the existing isAuthenticated$ observable
    return this.isAuthenticated$;
  }

  updateProfile(userData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/auth/profile`, userData);
  }

  // Add this method to force a refresh of user data
  refreshUserData(): Observable<any> {
    // Make a direct API call to get fresh user data
    return this.http.get(`${environment.apiUrl}/auth/me`).pipe(
      tap(user => console.log('Refreshed user data:', user))
    );
  }
}
