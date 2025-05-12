import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  // Make httpClient public so components can access it
  constructor(public http: HttpClient) {}
  
  // Make apiUrl public for access
  public get apiUrl(): string {
    return environment.apiUrl;
  }

  createTour(tourData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    return this.http.post(`${environment.apiUrl}/tours/publish`, tourData, { headers });
  }

  getAllTours(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/tours/all`).pipe(
      map(tours => {
        // Filter to only include published tours
        return tours.filter(tour => tour.status === 'published');
      })
    );
  }
  
  // Get tour details by ID - uses the public endpoint for published tours
  getTourById(id: number | string): Observable<any> {
    // Ensure ID is properly formatted
    const tourId = id.toString();
    console.log(`Fetching tour with ID: ${tourId} from API`);
    
    // Use the public endpoint for fetching tour details
    return this.http.get<any>(`${environment.apiUrl}/tours/public/${tourId}`).pipe(
      map(response => {
        console.log('API Response for tour details:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error fetching tour details:', error);
        return throwError(() => new Error('Failed to load tour details. Please try again.'));
      })
    );
  }
  
  // Get published tours with search and filter options
  getPublishedTours(filters?: any): Observable<any[]> {
    let url = `${environment.apiUrl}/tours/all`;
    // Add query parameters for filters if needed in the future
    return this.http.get<any[]>(url).pipe(
      map(tours => {
        let filteredTours = tours.filter(tour => tour.status === 'published');
        
        // Apply additional filters if provided
        if (filters) {
          if (filters.location) {
            filteredTours = filteredTours.filter((tour: any) => 
              tour.location.toLowerCase().includes(filters.location.toLowerCase())
            );
          }
          if (filters.minPrice) {
            filteredTours = filteredTours.filter((tour: any) => 
              parseFloat(tour.price) >= filters.minPrice
            );
          }
          if (filters.maxPrice) {
            filteredTours = filteredTours.filter((tour: any) => 
              parseFloat(tour.price) <= filters.maxPrice
            );
          }
        }
        
        return filteredTours;
      }),
      catchError(error => {
        console.error('Error fetching tours:', error);
        return throwError(() => new Error('Failed to load tours. Please try again.'));
      })
    );
  }

  // Get tours for the current user (bookings)
  getUserTours(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    
    return this.http.get<any[]>(`${environment.apiUrl}/tours/my-bookings`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching user tours:', error);
        return throwError(() => new Error('Failed to load your bookings. Please try again.'));
      })
    );
  }

  // Get tours created by the guide
  getGuideTours(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    
    return this.http.get<any>(`${environment.apiUrl}/tours/my-published`, { headers }).pipe(
      map(response => {
        console.log('Guide tours raw response:', response);
        // Handle different response formats - backend may return either {tours: [...]} or array directly
        if (response && response.tours) {
          return response.tours;
        }
        return Array.isArray(response) ? response : [];
      }),
      catchError(error => {
        console.error('Error fetching guide tours:', error);
        return throwError(() => new Error('Failed to load your tours. Please try again.'));
      })
    );
  }

  // Cancel a booked tour
  cancelTour(tourId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    
    return this.http.put(`${environment.apiUrl}/tours/cancel/${tourId}`, {}, { headers }).pipe(
      catchError(error => {
        console.error('Error cancelling tour:', error);
        return throwError(() => new Error('Failed to cancel tour. Please try again.'));
      })
    );
  }

  // Book a tour (requires authentication)
  bookTour(tourId: number, bookingData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    return this.http.post(`${environment.apiUrl}/tours/book/${tourId}`, bookingData, { headers });
  }

  // Update a published tour (requires authentication)
  updatePublishedTour(tourId: string | number, tourData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    
    console.log(`Updating tour ${tourId} with data:`, tourData);
    return this.http.put(`${environment.apiUrl}/tours/update/${tourId}`, tourData, { headers }).pipe(
      map(response => {
        console.log('Tour update response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error updating tour:', error);
        return throwError(() => new Error('Failed to update tour. Please try again.'));
      })
    );
  }

  // Get pending booking requests for guide
  getBookingRequests(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    
    return this.http.get<any>(`${environment.apiUrl}/tours/booking-requests`, { headers }).pipe(
      map(response => {
        // Check if the response has a bookingRequests property (matches your backend format)
        if (response && response.bookingRequests) {
          return response.bookingRequests;
        }
        // Fallback options if response format is different
        return response.bookings || response || [];
      }),
      catchError(error => {
        console.error('Error fetching booking requests:', error);
        return of([]);
      })
    );
  }
  
  // Get pending booking requests count for the notification badge
  getPendingBookingRequestsCount(): Observable<number> {
    return this.getBookingRequests().pipe(
      map(requests => requests.filter(req => req.approval_status === 'pending').length),
      catchError(() => of(0))
    );
  }

  // Get user's bookings with detailed status
  getUserBookingsWithStatus(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    
    return this.http.get<any>(`${environment.apiUrl}/tours/my-bookings`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching bookings with status:', error);
        return throwError(() => new Error('Failed to load your bookings. Please try again.'));
      })
    );
  }
  
  // Get guide's received bookings
  getGuideBookings(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    
    return this.http.get<any>(`${environment.apiUrl}/tours/guide-bookings`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching guide bookings:', error);
        return throwError(() => new Error('Failed to load guide bookings. Please try again.'));
      })
    );
  }
  
  // Approve a booking request
  approveBookingRequest(bookingId: number, notes?: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    
    return this.http.put<any>(`${environment.apiUrl}/tours/booking/${bookingId}/approve`, { notes }, { headers }).pipe(
      catchError(error => {
        console.error('Error approving booking request:', error);
        return throwError(() => new Error('Failed to approve booking. Please try again.'));
      })
    );
  }
  
  // Reject a booking request
  rejectBookingRequest(bookingId: number, reason: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    
    return this.http.put<any>(`${environment.apiUrl}/tours/booking/${bookingId}/reject`, { reason }, { headers }).pipe(
      catchError(error => {
        console.error('Error rejecting booking request:', error);
        return throwError(() => new Error('Failed to reject booking. Please try again.'));
      })
    );
  }
  
  // Get user's upcoming tours (agenda view)
  getUserAgenda(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    
    return this.http.get<any>(`${environment.apiUrl}/tours/my-agenda`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching user agenda:', error);
        return throwError(() => new Error('Failed to load your agenda. Please try again.'));
      })
    );
  }
  
  // Get guide's tour statistics
  getGuideStats(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    
    return this.http.get<any>(`${environment.apiUrl}/tours/guide-stats`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching guide statistics:', error);
        return throwError(() => new Error('Failed to load guide statistics. Please try again.'));
      })
    );
  }
}
