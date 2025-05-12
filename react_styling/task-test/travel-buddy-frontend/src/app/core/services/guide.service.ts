import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Guide } from '../../shared/models/guide.model';

@Injectable({
  providedIn: 'root'
})
export class GuideService {
  constructor(private http: HttpClient) {}

  createGuideProfile(guideData: any): Observable<any> {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    console.log('Using auth token:', token ? 'Token exists' : 'No token found'); // Debug log

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}` // Add token to Authorization header
    });

    return this.http.post(`${environment.apiUrl}/guides`, guideData, { headers });
  }

  getGuideProfile(userId: string): Observable<Guide> {
    return this.http.get<Guide>(`${environment.apiUrl}/guides/${userId}`);
  }

  updateGuideProfile(userId: string, guideData: any): Observable<Guide> {
    return this.http.put<Guide>(`${environment.apiUrl}/guides/${userId}`, guideData);
  }

  getAllGuides(): Observable<Guide[]> {
    return this.http.get<Guide[]>(`${environment.apiUrl}/guides`);
  }

  searchGuides(criteria: any): Observable<Guide[]> {
    return this.http.get<Guide[]>(`${environment.apiUrl}/guides/search`, { params: criteria });
  }

  getLocations(): Observable<string[]> {
    // TODO: Replace with actual API call once backend endpoint is ready
    return of([
      'Paris', 'Tokyo', 'New York', 'London', 'Rome',
      'Barcelona', 'Dubai', 'Singapore', 'Sydney', 'Hong Kong'
    ]);
  }

  getFeaturedGuides(): Observable<Guide[]> {
    return this.http.get<Guide[]>(`${environment.apiUrl}/guides/featured`);
  }

  getPopularDestinations(): Observable<any[]> {
    // TODO: Replace with actual API call once backend endpoint is ready
    return of([
      {
        name: 'Paris',
        description: 'Découvrez la ville lumière avec nos guides parisiens passionnés.',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
        guidesCount: 45
      },
      {
        name: 'Tokyo',
        description: 'Explorez la culture japonaise avec nos guides locaux.',
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
        guidesCount: 32
      },
      {
        name: 'New York',
        description: 'Visitez la Big Apple comme un véritable New-Yorkais.',
        imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80',
        guidesCount: 28
      }
    ]);
  }

  getTestimonials(): Observable<any[]> {
    // TODO: Replace with actual API call once backend endpoint is ready
    return of([
      {
        userName: 'Sophie Martin',
        comment: 'Une expérience inoubliable avec notre guide à Paris. Je recommande vivement !',
        rating: 5,
        destination: 'Paris',
        userImage: 'https://randomuser.me/api/portraits/women/1.jpg'
      },
      {
        userName: 'Jean Dupont',
        comment: 'Découverte de Tokyo comme un local grâce à notre guide. Parfait !',
        rating: 5,
        destination: 'Tokyo',
        userImage: 'https://randomuser.me/api/portraits/men/1.jpg'
      }
    ]);
  }

  createTour(tourData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    return this.http.post(`${environment.apiUrl}/tours`, tourData, { headers });
  }
}
