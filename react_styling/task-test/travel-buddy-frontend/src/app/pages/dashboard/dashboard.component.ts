import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TourService } from '../../core/services/tour.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit {
  userName: string = 'User';
  isGuide: boolean = false;
  
  // Statistics
  userStats = {
    toursBooked: 0,
    upcomingTours: 0,
    completedTours: 0
  };
  
  guideStats = {
    totalClients: 0,
    publishedTours: 0,
    averageRating: 0
  };
  
  // Tour lists
  upcomingTours: any[] = [];
  guideTours: any[] = [];
  
  // Activity history
  activities: any[] = [];

  constructor(
    private authService: AuthService,
    private tourService: TourService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    this.loadActivityData();
  }

  loadUserData(): void {
    // Use getUser() instead of user$
    this.authService.getUser().subscribe({
      next: (user: any) => {
        if (user) {
          this.userName = user.prenom || user.nom || 'User';
          this.isGuide = user.role === 'guide';
          
          // Load tour data after we know the user's role
          this.loadTourData();
        }
      },
      error: (error) => {
        console.error('Error getting user data:', error);
      }
    });
  }

  loadTourData(): void {
    if (this.isGuide) {
      // Load guide-specific data
      this.tourService.getGuideTours().subscribe({
        next: (tours) => {
          console.log('Received guide tours:', tours);
          this.guideTours = tours || [];
          this.guideStats.publishedTours = this.guideTours.length;
          
          // Calculate total clients only if we have tours with clients
          const clients = new Set();
          if (Array.isArray(this.guideTours)) {
            this.guideTours.forEach(tour => {
              if (tour.client_id) clients.add(tour.client_id);
            });
          }
          this.guideStats.totalClients = clients.size;
        },
        error: (error) => console.error('Error loading guide tours:', error)
      });
    } else {
      // Load regular user data - this returns bookings with tour information
      this.tourService.getUserTours().subscribe({
        next: (bookings: any[]) => {
          console.log('Received user bookings:', bookings);
          // Check if we have bookings data
          if (bookings && bookings.length > 0) {
            this.userStats.toursBooked = bookings.length;
            
            // Filter upcoming tours
            const today = new Date();
            
            // Map bookings to a format that matches what the template expects
            this.upcomingTours = bookings
              .filter((booking: any) => {
                if (!booking.tour) return false;
                const tourDate = booking.booking_date ? new Date(booking.booking_date) : null;
                return tourDate && tourDate >= today && booking.status !== 'cancelled';
              })
              .map((booking: any) => {
                return {
                  ...booking.tour,
                  tour_id: booking.tour_id,
                  date: new Date(booking.booking_date),
                  startTime: booking.booking_time,
                  participants: booking.participants,
                  booking_id: booking.booking_id,
                  approval_status: booking.approval_status,
                  booking_reference: booking.booking_reference
                };
              });
            
            this.userStats.upcomingTours = this.upcomingTours.length;
            this.userStats.completedTours = bookings.filter((booking: any) => booking.status === 'completed').length;
          } else {
            console.warn('No bookings data received or empty array');
          }
        },
        error: (error: any) => {
          console.error('Error loading user bookings:', error);
        }
      });
    }
  }

  loadActivityData(): void {
    // This would typically come from an API
    // Using mock data for now
    this.activities = [
      {
        type: 'booking',
        description: 'You booked "Paris City Tour"',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        type: 'profile',
        description: 'You updated your profile information',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      }
    ];
  }

  cancelTour(tourId: number): void {
    if (confirm('Are you sure you want to cancel this tour?')) {
      this.tourService.cancelTour(tourId).subscribe({
        next: () => {
          this.upcomingTours = this.upcomingTours.filter(tour => tour.tour_id !== tourId);
          this.userStats.upcomingTours = this.upcomingTours.length;
          
          // Add cancellation to activity
          this.activities.unshift({
            type: 'cancellation',
            description: 'You cancelled a tour booking',
            timestamp: new Date()
          });
        },
        error: (error) => console.error('Error cancelling tour:', error)
      });
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'booking': return 'fa-calendar-plus';
      case 'cancellation': return 'fa-calendar-times';
      case 'payment': return 'fa-credit-card';
      case 'review': return 'fa-star';
      case 'profile': return 'fa-user-edit';
      default: return 'fa-bell';
    }
  }

  // Method to handle tour editing
  editTour(tour: any): void {
    console.log('Editing tour:', tour);
    console.log('Tour ID:', tour.tour_id);
    
    if (!tour || !tour.tour_id) {
      console.error('Tour ID is missing!', tour);
      return;
    }
    
    // Navigate to the edit tour page
    this.router.navigate(['/edit-tour', tour.tour_id]);
  }
}