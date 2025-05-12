import { Component, OnInit } from '@angular/core';
import { TourService } from '../../core/services/tour.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Define interfaces locally since we're changing to the core service
interface Booking {
  booking_id: number;
  tour_id: string;
  user_id: number;
  booking_date: string;
  booking_time: string;
  participants: number;
  special_requirements?: string;
  contact_info: any;
  payment_info: any;
  pricing: any;
  booking_reference: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  approval_status: 'pending' | 'approved' | 'rejected';
  guide_notes?: string;
  created_at: Date;
  updated_at: Date;
  tour?: any;
  statusMessage?: string;
}

interface BookingResponse {
  bookings: Booking[];
  statusCounts: {
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
    total: number;
  };
}

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  statusCounts = {
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    total: 0
  };
  loading = true;
  error = '';
  activeTab = 'all';
  
  constructor(private tourService: TourService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.tourService.getUserBookingsWithStatus().subscribe({
      next: (response: any) => {
        console.log('Bookings response:', response);
        // Handle both response formats (direct array or object with bookings property)
        if (Array.isArray(response)) {
          this.bookings = response;
          // Calculate status counts
          this.calculateStatusCounts();
        } else if (response && response.bookings) {
          this.bookings = response.bookings;
          this.statusCounts = response.statusCounts || this.calculateStatusCounts();
        } else {
          this.bookings = [];
          this.statusCounts = {
            pending: 0,
            approved: 0,
            rejected: 0,
            cancelled: 0,
            total: 0
          };
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        this.error = 'Une erreur est survenue lors du chargement de vos réservations.';
        this.loading = false;
      }
    });
  }
  
  // Helper method to calculate status counts from bookings array
  calculateStatusCounts() {
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      total: this.bookings.length
    };
    
    this.bookings.forEach(booking => {
      if (booking.status === 'cancelled') {
        counts.cancelled++;
      } else if (booking.approval_status === 'pending') {
        counts.pending++;
      } else if (booking.approval_status === 'approved') {
        counts.approved++;
      } else if (booking.approval_status === 'rejected') {
        counts.rejected++;
      }
    });
    
    return counts;
  }

  // Create a local wrapper for missing method in core/services/tour.service
  getUserBookingsWithStatus() {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    };
    
    return this.tourService['http'].get<BookingResponse>(
      `${this.getApiUrl()}/tours/my-bookings`, 
      { headers }
    );
  }

  // Helper to get API URL
  private getApiUrl(): string {
    // Access environment variables
    try {
      // Try to dynamically access environment from the service
      return (this.tourService as any).apiUrl || 'http://localhost:3000/api';
    } catch (e) {
      // Fallback to hardcoded API URL
      return 'http://localhost:3000/api';
    }
  }

  // Use cancellTour instead of cancelBooking to match core service method
  cancelBooking(booking: Booking) {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    this.tourService.cancelTour(booking.booking_id).subscribe({
      next: () => {
        // Update the local booking status
        booking.status = 'cancelled';
        booking.statusMessage = 'Réservation annulée';
        
        // Refresh counts
        this.statusCounts.cancelled++;
        if (booking.approval_status === 'pending') {
          this.statusCounts.pending--;
        } else if (booking.approval_status === 'approved') {
          this.statusCounts.approved--;
        }
      },
      error: (err) => {
        console.error('Error cancelling booking:', err);
        alert('Une erreur est survenue lors de l\'annulation de la réservation.');
      }
    });
  }

  changeTab(tab: string) {
    this.activeTab = tab;
  }

  getFilteredBookings(): Booking[] {
    if (this.activeTab === 'all') {
      return this.bookings;
    }

    return this.bookings.filter(booking => {
      switch (this.activeTab) {
        case 'pending': return booking.approval_status === 'pending';
        case 'upcoming': return booking.approval_status === 'approved' && booking.status === 'confirmed';
        case 'completed': return booking.status === 'completed';
        case 'rejected': return booking.approval_status === 'rejected';
        case 'cancelled': return booking.status === 'cancelled';
        default: return true;
      }
    });
  }

  formatDate(dateStr: string | Date | undefined): string {
    if (!dateStr) return 'Date inconnue';
    const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  getStatusClass(booking: Booking): string {
    if (booking.approval_status === 'pending') return 'status-pending';
    if (booking.approval_status === 'rejected') return 'status-rejected';
    if (booking.status === 'cancelled') return 'status-cancelled';
    if (booking.status === 'completed') return 'status-completed';
    return 'status-approved';
  }

  // Helper methods for safe calculations in template
  getTotalPrice(booking: Booking): number {
    if (booking.pricing?.total) {
      return booking.pricing.total;
    } else if (booking.tour?.price && booking.participants) {
      return booking.tour.price * booking.participants;
    } else {
      return 0;
    }
  }
}
