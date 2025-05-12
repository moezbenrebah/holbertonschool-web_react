import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    nom: string;
    prenom: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<AuthResponse> {
    console.log('Sending registration request:', userData);
    return this.http.post<AuthResponse>(`${this.apiUrl}/inscription`, userData).pipe(
      tap({
        next: (response) => console.log('Registration response:', response),
        error: (error) => console.error('Registration request error:', error)
      })
    );
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/connexion`, credentials)
      .pipe(
        tap((response: AuthResponse) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  updateProfile(profileData: any): Observable<any> {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}` // Add token to Authorization header
    });

    return this.http.post(`${environment.apiUrl}/users/profile`, profileData, { headers });
  }
}
