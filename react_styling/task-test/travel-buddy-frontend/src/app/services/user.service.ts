import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './auth.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users: User[]) => {
        // Map users to ensure they have the active property
        return users.map(user => ({
          ...user,
          active: user.active !== undefined ? user.active : true // Default to true if active is not defined
        }));
      }),
      catchError(error => {
        console.error('Error fetching users from API, using mock data instead:', error);
        // Fall back to mock data if API fails
        return this.getMockUsers();
      })
    );
  }

  getUsersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${user.user_id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // For development without backend
  getMockUsers(): Observable<User[]> {
    const mockUsers = [
      {
        user_id: 1,
        email: 'admin@example.com',
        nom: 'Admin',
        prenom: 'Super',
        profileImage: '/assets/images/default-profile.png',
        role: 'admin',
        active: true,
        createdAt: new Date()
      },
      {
        user_id: 2,
        email: 'user@example.com',
        nom: 'User',
        prenom: 'Regular',
        profileImage: '/assets/images/default-profile.png',
        role: 'user',
        active: true,
        createdAt: new Date()
      },
      {
        user_id: 3,
        email: 'guide@example.com',
        nom: 'Guide',
        prenom: 'Tour',
        profileImage: '/assets/images/default-profile.png',
        role: 'guide',
        active: true,
        createdAt: new Date()
      }
    ];
    return of(mockUsers);
  }

  getMockUsersCount(): Observable<number> {
    return of(3);
  }

  // Set a user as admin (for development purposes)
  setUserAsAdmin(userId: number): Observable<User> {
    // In a real app, you would make an API call to update the user's role
    // For development, we'll just return a mock response
    const mockResponse = {
      user_id: userId,
      email: 'admin@example.com',
      nom: 'Admin',
      prenom: 'New',
      profileImage: '/assets/images/default-profile.png',
      role: 'admin',
      active: true,
      createdAt: new Date()
    };
    return of(mockResponse);
  }
}