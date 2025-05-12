import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './auth.service';

export interface Guide {
  id?: string;
  guide_id?: string;
  user_id: number;
  title?: string;
  description?: string;
  location?: string;
  specialty?: string;
  specialites?: string;  // Match backend field name
  experience?: number;
  languages?: string;
  langues?: string;     // Match backend field name
  presentation?: string;
  price?: number;
  user?: User;
  active?: boolean;
  rating?: number;
  tourCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GuideApplication {
  id: string;
  user_id: number;
  specialty: string;
  experience: number;
  languages: string;
  presentation: string;
  applicationDate: Date;
  status: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class GuideService {
  private apiUrl = `${environment.apiUrl}/guides`;

  constructor(private http: HttpClient) { }

  getGuides(): Observable<Guide[]> {
    // Try to get real data first, fall back to mock data if it fails
    return this.http.get<Guide[]>(this.apiUrl).pipe(
      map((guides: Guide[]) => {
        // Map guides to ensure they have an id and active property
        return guides.map(guide => ({
          ...guide,
          id: guide.guide_id || guide.id, // Use guide_id if available, otherwise use id
          active: guide.active !== undefined ? guide.active : true, // Default to true if active is not defined
          specialty: guide.specialty || guide.specialites, // Handle different field names
          languages: guide.languages || guide.langues // Handle different field names
        }));
      }),
      catchError(error => {
        console.error('Error fetching guides from API, using mock data instead:', error);
        return this.getMockGuides();
      })
    );
  }

  getGuideById(id: string): Observable<Guide> {
    return this.http.get<Guide>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching guide ${id}, using mock data instead:`, error);
        // Return a mock guide if API call fails
        return of({
          id: id,
          user_id: 3,
          specialty: 'Histoire de Paris',
          experience: 5,
          languages: 'Français, Anglais',
          presentation: 'Guide passionné d\'histoire',
          active: true,
          rating: 4.7,
          tourCount: 8,
          user: {
            user_id: 3,
            email: 'guide@example.com',
            nom: 'Durand',
            prenom: 'Pierre',
            profileImage: '/assets/images/default-profile.png',
            role: 'guide'
          }
        });
      })
    );
  }

  createGuide(guide: any): Observable<Guide> {
    return this.http.post<Guide>(this.apiUrl, guide);
  }

  updateGuide(guide: Guide): Observable<Guide> {
    return this.http.put<Guide>(`${this.apiUrl}/${guide.id}`, guide);
  }

  deleteGuide(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getGuideApplications(): Observable<GuideApplication[]> {
    return this.http.get<GuideApplication[]>(`${this.apiUrl}/applications`).pipe(
      catchError(error => {
        console.error('Error fetching guide applications, using mock data instead:', error);
        return this.getMockPendingApplications();
      })
    );
  }

  approveGuideApplication(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/applications/${id}/approve`, {});
  }

  rejectGuideApplication(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/applications/${id}/reject`, {});
  }

  // Mock data for development
  getMockGuides(): Observable<Guide[]> {
    const mockGuides: Guide[] = [
      {
        id: '1',
        user_id: 3,
        specialty: 'Histoire de Paris',
        experience: 5,
        languages: 'Français, Anglais',
        presentation: 'Guide passionné d\'histoire',
        active: true,
        rating: 4.7,
        tourCount: 8,
        user: {
          user_id: 3,
          email: 'guide@example.com',
          nom: 'Durand',
          prenom: 'Pierre',
          profileImage: '/assets/images/default-profile.png',
          role: 'guide'
        }
      },
      {
        id: '2',
        user_id: 4,
        specialty: 'Gastronomie de Lyon',
        experience: 3,
        languages: 'Français, Espagnol',
        presentation: 'Spécialiste de la gastronomie lyonnaise',
        active: true,
        rating: 4.5,
        tourCount: 5,
        user: {
          user_id: 4,
          email: 'guide2@example.com',
          nom: 'Lefebvre',
          prenom: 'Sophie',
          profileImage: '/assets/images/default-profile.png',
          role: 'guide'
        }
      }
    ];
    return of(mockGuides);
  }

  getMockPendingApplications(): Observable<GuideApplication[]> {
    const mockApplications: GuideApplication[] = [
      {
        id: '1',
        user_id: 5,
        specialty: 'Randonnées en montagne',
        experience: 7,
        languages: 'Français, Anglais, Allemand',
        presentation: 'J\'ai 7 ans d\'expérience comme guide de randonnée dans les Alpes. Je connais parfaitement la région et ses sentiers cachés.',
        applicationDate: new Date(),
        status: 'pending',
        user: {
          user_id: 5,
          email: 'marc@example.com',
          nom: 'Bouvier',
          prenom: 'Marc',
          profileImage: '/assets/images/default-profile.png',
          role: 'user'
        }
      }
    ];
    return of(mockApplications);
  }
}