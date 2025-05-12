import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TourService } from '../../core/services/tour.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ProfileImagePipe } from '../../shared/pipes/profile-image.pipe';

// Define interfaces locally since we're changing to core services
interface User {
  user_id: number;
  prenom: string;
  nom: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface Tour {
  tour_id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  guide_id: string;
  imageUrl?: string; // Added imageUrl property
  // Add other properties as needed
}

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
  tour?: Tour;
}

// Extended interface to match what's returned by the API for booking requests
interface BookingRequest extends Booking {
  user?: User;
  // tour is already optional in the Booking interface
}

@Component({
  selector: 'app-booking-requests',
  templateUrl: './booking-requests.component.html',
  styleUrls: ['./booking-requests.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, ProfileImagePipe]
})
export class BookingRequestsComponent implements OnInit {
  loading: boolean = true;
  error: string = '';
  pendingRequests: BookingRequest[] = [];
  selectedRequest: BookingRequest | null = null;
  approvalNotes: string = '';
  rejectReason: string = '';

  constructor(
    private tourService: TourService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Check if user is a guide
    this.authService.getUser().subscribe({
      next: (user) => {
        if (user && user.role === 'guide') {
          this.loadPendingRequests();
        } else {
          this.error = 'Vous devez être un guide pour accéder à cette page.';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error fetching user:', error);
        this.error = 'Erreur lors de la vérification de vos autorisations.';
        this.loading = false;
      }
    });
  }

  // Load all pending booking requests for the guide
  loadPendingRequests(): void {
    this.loading = true;
    this.error = '';
    
    this.tourService.getBookingRequests().subscribe({
      next: (response) => {
        // Validate data to ensure all required properties are available
        this.pendingRequests = response.map(request => {
          const bookingRequest: BookingRequest = {...request};
          
          // Make sure we have at least an empty object for nested properties
          if (!bookingRequest.tour) {
            bookingRequest.tour = {} as Tour;
          }
          if (!bookingRequest.user) {
            bookingRequest.user = {} as User;
          }
          
          return bookingRequest;
        });
        
        console.log('Pending requests data:', this.pendingRequests);
        this.loading = false;
        
        // Reset any selected request if it's no longer in the list
        if (this.selectedRequest) {
          const stillExists = this.pendingRequests.find(r => 
            r.booking_id === this.selectedRequest?.booking_id
          );
          if (!stillExists) {
            this.selectedRequest = null;
          }
        }
      },
      error: (err) => {
        console.error('Error fetching booking requests:', err);
        this.error = 'Erreur lors du chargement des demandes de réservation.';
        this.loading = false;
        this.pendingRequests = [];
      }
    });
  }

  // View detailed information about a specific request
  viewRequestDetails(request: BookingRequest): void {
    // Make a copy to avoid modifying the original
    const safeRequest = { ...request };
    
    // Make sure we have empty objects for nested properties
    if (!safeRequest.tour) {
      safeRequest.tour = {} as Tour;
    }
    if (!safeRequest.user) {
      safeRequest.user = {} as User;
    }
    
    this.selectedRequest = safeRequest;
    // Reset approval/rejection inputs
    this.approvalNotes = '';
    this.rejectReason = '';
  }

  // Close the details panel and return to the list view
  closeDetails(): void {
    this.selectedRequest = null;
    this.approvalNotes = '';
    this.rejectReason = '';
  }

  // Approve a booking request
  approveRequest(bookingId: number): void {
    if (!confirm('Êtes-vous sûr d\'accepter cette réservation ?')) {
      return;
    }
    
    this.loading = true;
    
    this.tourService.approveBookingRequest(bookingId, this.approvalNotes).subscribe({
      next: (response) => {
        this.toastr.success('Réservation approuvée avec succès !');
        this.loadPendingRequests();
        this.selectedRequest = null;
      },
      error: (err) => {
        console.error('Error approving booking:', err);
        this.toastr.error('Erreur lors de l\'approbation de la réservation.');
        this.loading = false;
      }
    });
  }

  // Reject a booking request
  rejectRequest(bookingId: number): void {
    if (!this.rejectReason) {
      this.toastr.warning('Veuillez fournir une raison de refus.');
      return;
    }
    
    if (!confirm('Êtes-vous sûr de vouloir rejeter cette réservation ?')) {
      return;
    }
    
    this.loading = true;
    
    this.tourService.rejectBookingRequest(bookingId, this.rejectReason).subscribe({
      next: (response) => {
        this.toastr.success('Réservation rejetée.');
        this.loadPendingRequests();
        this.selectedRequest = null;
      },
      error: (err) => {
        console.error('Error rejecting booking:', err);
        this.toastr.error('Erreur lors du rejet de la réservation.');
        this.loading = false;
      }
    });
  }

  // Format currency for display
  formatCurrency(amount: number): string {
    if (!amount && amount !== 0) return '';
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  }

  // Helper method to safely calculate price
  calculatePrice(price?: number, participants?: number): number {
    if (price === undefined || participants === undefined) {
      return 0;
    }
    return price * participants;
  }
}
