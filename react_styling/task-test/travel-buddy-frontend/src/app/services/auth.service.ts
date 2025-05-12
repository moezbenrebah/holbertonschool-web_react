import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface User {
  user_id: number;
  email: string;
  nom: string;
  prenom: string;
  profileImage: string;
  role: string;
  active?: boolean;
  createdAt?: Date;
}

interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  public isAuthenticated$ = this.user$.pipe(map(user => !!user));
  private jwtHelper = new JwtHelperService();
  
  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        // Load the user even if token is expired (we'll refresh it later if needed)
        this.userSubject.next(JSON.parse(user));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        this.logout();
      }
    }
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      return true;
    }
  }

  // Add refresh token method
  refreshToken(): Observable<AuthResponse> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { token })
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(error => {
          // Only logout on certain errors, not all
          if (error.status === 401) {
            this.logout();
          }
          return throwError(() => error);
        })
      );
  }

  // Check and refresh token if needed before making API calls
  ensureAuthToken(): Observable<string | null> {
    if (this.isTokenExpired()) {
      return this.refreshToken().pipe(
        map(() => this.getToken()),
        catchError(() => {
          // If refresh fails, just return the current token
          // It's up to the API call to handle 401 errors
          return of(this.getToken());
        })
      );
    }
    return of(this.getToken());
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => this.handleAuthentication(response))
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => this.handleAuthentication(response))
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getCurrentUser(): Observable<User | null> {
    // Don't immediately try to refresh token here
    const token = this.getToken();
    if (!token) return of(null);

    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        // Store the full user object that comes back from the API
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
      }),
      catchError(error => {
        console.error('Error getting current user:', error);
        // Only logout on authentication errors
        if (error.status === 401) {
          console.log('Authentication error, attempting to refresh token');
          // Try refreshing token once
          return this.refreshToken().pipe(
            switchMap(() => this.http.get<User>(`${this.apiUrl}/me`)),
            tap(user => {
              localStorage.setItem('user', JSON.stringify(user));
              this.userSubject.next(user);
            }),
            catchError((refreshError) => {
              console.error('Token refresh failed:', refreshError);
              this.logout();
              return of(null);
            })
          );
        }
        return of(null);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.userSubject.next(response.user);
  }

  // New method to get current user directly from stored data
  getUser(): Observable<User | null> {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userSubject.next(user); // Update the behavior subject
        return of(user);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
    
    // Only make the API call if we don't have user data in localStorage
    return this.getCurrentUser().pipe(
      catchError(error => {
        console.error('Error getting user data:', error);
        // Return null instead of throwing to prevent app crashes
        return of(null);
      })
    );
  }

  updateProfile(userData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/users/profile`, userData)
      .pipe(
        tap(response => {
          // Update the stored user data if the API returns updated user info
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
            this.userSubject.next(response.user);
          }
        })
      );
  }

  createGuideProfile(guideData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/guides`, guideData)
      .pipe(
        tap(response => {
          // If the guide creation updates the user role, refresh the user data
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
            this.userSubject.next(response.user);
          }
        })
      );
  }

  createTour(tourData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/tours`, tourData);
  }
}
