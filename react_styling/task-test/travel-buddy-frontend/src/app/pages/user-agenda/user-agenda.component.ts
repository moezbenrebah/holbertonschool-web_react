import { Component, OnInit } from '@angular/core';
import { TourService, Booking, BookingResponse } from '../../services/tour.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-agenda',
  templateUrl: './user-agenda.component.html',
  styleUrl: './user-agenda.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class UserAgendaComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  error = '';
  // Group by status for easy filtering
  groupedBookings: {
    upcoming: Booking[];
    past: Booking[];
    pending: Booking[];
    rejected: Booking[];
    cancelled: Booking[];
  } = {
    upcoming: [],
    past: [],
    pending: [],
    rejected: [],
    cancelled: []
  };

  activeView = 'upcoming';
  searchTerm = '';

  constructor(private tourService: TourService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.tourService.getUserBookingsWithStatus().subscribe({
      next: (response: BookingResponse) => {
        this.bookings = response.bookings;
        this.categorizeBookings();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        this.error = 'Une erreur est survenue lors du chargement de vos tours.';
        this.loading = false;
      }
    });
  }

  categorizeBookings(): void {
    const today = new Date();

    // Reset groups
    this.groupedBookings = {
      upcoming: [],
      past: [],
      pending: [],
      rejected: [],
      cancelled: []
    };

    // Categorize each booking
    this.bookings.forEach(booking => {
      const bookingDate = new Date(booking.booking_date);

      if (booking.approval_status === 'pending') {
        this.groupedBookings.pending.push(booking);
      } else if (booking.approval_status === 'rejected') {
        this.groupedBookings.rejected.push(booking);
      } else if (booking.status === 'cancelled') {
        this.groupedBookings.cancelled.push(booking);
      } else if (booking.approval_status === 'approved' && booking.status === 'confirmed') {
        if (bookingDate >= today) {
          this.groupedBookings.upcoming.push(booking);
        } else {
          this.groupedBookings.past.push(booking);
        }
      } else {
        // Default for completed or other status
        this.groupedBookings.past.push(booking);
      }
    });

    // Sort upcoming tours by date (closest first)
    this.groupedBookings.upcoming.sort((a, b) => 
      new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime()
    );

    // Sort past tours by date (most recent first)
    this.groupedBookings.past.sort((a, b) => 
      new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
    );
  }

  changeView(view: string): void {
    this.activeView = view;
  }

  formatDate(dateStr: string | Date | undefined): string {
    if (!dateStr) return 'Date inconnue';
    const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
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

  searchBookings(): Booking[] {
    if (!this.searchTerm.trim()) {
      return this.getViewBookings();
    }

    const term = this.searchTerm.toLowerCase().trim();
    return this.getViewBookings().filter(booking => 
      booking.tour?.title.toLowerCase().includes(term) ||
      booking.tour?.location.toLowerCase().includes(term) ||
      booking.tour?.guide?.user?.prenom.toLowerCase().includes(term) ||
      booking.tour?.guide?.user?.nom.toLowerCase().includes(term)
    );
  }

  getViewBookings(): Booking[] {
    switch (this.activeView) {
      case 'upcoming': return this.groupedBookings.upcoming;
      case 'past': return this.groupedBookings.past;
      case 'pending': return this.groupedBookings.pending;
      case 'rejected': return this.groupedBookings.rejected;
      case 'cancelled': return this.groupedBookings.cancelled;
      default: return this.bookings;
    }
  }

  cancelBooking(booking: Booking): void {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    this.tourService.cancelBooking(booking.booking_id).subscribe({
      next: () => {
        // Update local data
        booking.status = 'cancelled';
        booking.statusMessage = 'Réservation annulée';
        this.categorizeBookings();
      },
      error: (err) => {
        console.error('Error cancelling booking:', err);
        alert('Une erreur est survenue lors de l\'annulation de la réservation.');
      }
    });
  }
  
  // Helper method for template to fix errors with Date in template
  getDateDay(dateStr: string): number {
    return new Date(dateStr).getDate();
  }
  
  getDateMonth(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {month: 'short'});
  }
  
  // Helper methods to safely access possibly undefined properties
  getGuideName(booking: Booking): string {
    if (!booking.tour?.guide?.user) return 'Guide inconnu';
    return `${booking.tour.guide.user.prenom || ''} ${booking.tour.guide.user.nom || ''}`.trim() || 'Guide inconnu';
  }
  
  getGuideEmail(booking: Booking): string {
    return booking.tour?.guide?.user?.email || 'Email non disponible';
  }
  
  getGuideImage(booking: Booking): string {
    return booking.tour?.guide?.user?.profileImage || 'assets/images/default-profile.png';
  }
  
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
