import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { TourService } from '../../core/services/tour.service';
import { AuthService } from '../../core/services/auth.service';
import { DatePipe } from '@angular/common';
import { ProfileImagePipe } from '../../shared/pipes/profile-image.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-tour',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DatePipe,
    ProfileImagePipe
  ],
  templateUrl: './book-tour.component.html',
  styleUrl: './book-tour.component.css'
})
export class BookTourComponent implements OnInit {
  currentStep = 1;
  loading = true;
  submitting = false;
  error = '';
  success = false;
  bookingForm!: FormGroup;
  paymentForm!: FormGroup;
  
  tour: any = null;
  tourId: string | null = null;
  participantsCount = 1;
  bookingReference = '';
  
  // Added properties for promo codes and discounts
  promoCodeApplied = false;
  promoCode = '';
  discountAmount = 0;
  discountPercent = 0;
  
  // Property to track if user wants to continue iteration
  continueIteration = false;
  
  // Payment method options
  paymentMethods = [
    { id: 'creditCard', name: 'Carte de crédit', icon: 'fa-credit-card' },
    { id: 'paypal', name: 'PayPal', icon: 'fa-paypal' },
    { id: 'bankTransfer', name: 'Virement bancaire', icon: 'fa-university' }
  ];
  
  // Today's date for booking validation
  today = new Date();
  minDate = this.today.toISOString().split('T')[0];
  maxDate = new Date(this.today.getFullYear() + 1, this.today.getMonth(), this.today.getDate()).toISOString().split('T')[0];
  
  // Countries for address form
  countries = [
    'France', 'Allemagne', 'Belgique', 'Espagne', 'Italie', 'Luxembourg', 
    'Pays-Bas', 'Portugal', 'Royaume-Uni', 'Suisse', 'États-Unis', 'Canada'
  ];
  
  // For payment step validation
  termsAgreed = false;
  
  // Property declarations
  bookingSuccessful = false;
  bookingError = false;
  errorMessage = '';

  // Properties to track booking state and user selections
  selectedDate: Date | null = null;
  userBookings: any[] = [];

  // Add Math reference to make it available in the template
  Math = Math;
  
  // Add missing guide property
  guide: any = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Initialize forms
    this.initForms();
    
    // Get tour ID and participant count from route
    this.route.paramMap.subscribe(params => {
      this.tourId = params.get('id');
      
      this.route.queryParamMap.subscribe(queryParams => {
        const participantsParam = queryParams.get('participants');
        if (participantsParam) {
          this.participantsCount = parseInt(participantsParam, 10);
          // Update participant count in form
          this.bookingForm.patchValue({ participants: this.participantsCount });
        }
        
        if (!this.tourId) {
          this.error = 'Tour introuvable - ID manquant';
          this.loading = false;
          return;
        }
        
        this.loadTourDetails(this.tourId);
      });
    });
    
    // Get the current user
    this.authService.getUser().subscribe({
      next: (user) => {
        if (user) {
          this.prefillUserData();
          this.loadUserBookings();
        }
      },
      error: (error: any) => {
        console.error('Error getting current user:', error);
      }
    });
  }
  
  // Initialize forms
  initForms(): void {
    // Booking details form
    this.bookingForm = this.formBuilder.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      participants: [this.participantsCount, [Validators.required, Validators.min(1)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+\d{1,3})?\s?\d{9,10}$/)]],
      specialRequirements: [''],
      promoCode: ['']
    });
    
    // Payment form with conditional validation
    this.paymentForm = this.formBuilder.group({
      paymentMethod: ['creditCard', Validators.required],
      cardName: [''],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required]
    });
    
    // Set up conditional validation for payment fields
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      if (method === 'creditCard') {
        this.paymentForm.get('cardName')?.setValidators([Validators.required]);
        this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
        this.paymentForm.get('expiryDate')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
        this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
      } else {
        this.paymentForm.get('cardName')?.clearValidators();
        this.paymentForm.get('cardNumber')?.clearValidators();
        this.paymentForm.get('expiryDate')?.clearValidators();
        this.paymentForm.get('cvv')?.clearValidators();
      }
      
      // Update validation status
      this.paymentForm.get('cardName')?.updateValueAndValidity();
      this.paymentForm.get('cardNumber')?.updateValueAndValidity();
      this.paymentForm.get('expiryDate')?.updateValueAndValidity();
      this.paymentForm.get('cvv')?.updateValueAndValidity();
    });
  }
  
  // Load tour details
  loadTourDetails(id: string): void {
    this.loading = true;
    
    this.tourService.getTourById(id).subscribe({
      next: (response) => {
        if (response && response.tour) {
          this.tour = response.tour;
        } else if (response) {
          this.tour = response;
        } else {
          this.error = 'Format de réponse invalide';
        }
        
        this.loading = false;
        
        // Pre-fill email if user is authenticated
        this.loadUserInfo();
      },
      error: (err) => {
        console.error('Error fetching tour:', err);
        this.error = 'Erreur lors du chargement du tour. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }
  
  // Load user info to pre-fill form
  loadUserInfo(): void {
    // Use getUser instead of getCurrentUser
    this.authService.getUser().subscribe((user: { email: any; prenom: any; nom: any; telephone: any; }) => {
      if (user) {
        this.bookingForm.patchValue({
          contactInfo: {
            name: user.prenom + ' ' + user.nom,
            email: user.email,
            phone: user.telephone || ''
          }
        });
      }
    });
  }
  
  // Apply promo code
  applyPromoCode(): void {
    const promoCode = this.bookingForm.get('promoCode')?.value;
    if (!promoCode) return;
    
    this.loading = true;
    
    // Example promo codes - in real app, this would come from an API
    const validPromoCodes = {
      'SUMMER25': { type: 'percent', value: 25 },
      'WELCOME10': { type: 'percent', value: 10 },
      'TRAVEL50': { type: 'fixed', value: 50 }
    };
    
    // Simulate API call
    setTimeout(() => {
      // @ts-ignore - simplified for demo
      const discount = validPromoCodes[promoCode];
      
      if (discount) {
        this.promoCodeApplied = true;
        this.promoCode = promoCode;
        
        if (discount.type === 'percent') {
          this.discountPercent = discount.value;
          this.discountAmount = (this.getTotalPrice() * discount.value) / 100;
        } else {
          this.discountPercent = 0;
          this.discountAmount = discount.value;
        }
      } else {
        this.promoCodeApplied = false;
        this.error = 'Code promo invalide';
        setTimeout(() => this.error = '', 3000);
      }
      
      this.loading = false;
    }, 1000);
  }
  
  // Remove applied promo code
  removePromoCode(): void {
    this.promoCodeApplied = false;
    this.promoCode = '';
    this.discountAmount = 0;
    this.discountPercent = 0;
    this.bookingForm.patchValue({ promoCode: '' });
  }
  
  // Calculate total price with discount
  calculateTotal(): number {
    const basePrice = this.getTotalPrice();
    return Math.max(0, basePrice - this.discountAmount);
  }
  
  // Calculate total price
  getTotalPrice(): number {
    return (this.tour?.price || 0) * this.participantsCount;
  }
  
  // Get formatted date for display
  getFormattedDate(): string {
    const dateValue = this.bookingForm.get('date')?.value;
    if (!dateValue) return '';
    
    // Ensure we have a proper Date object by creating a new one
    try {
      // Handle string dates from form input
      const dateObj = new Date(dateValue);
      return this.formatDateWithDay(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateValue.toString(); // Fallback to simple string representation
    }
  }

  // Format date with day of week
  formatDateWithDay(date: Date | string | null): string {
    if (!date) return '';
    
    try {
      // Ensure we're working with a Date object
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        console.error('Invalid date object:', date);
        return String(date);
      }
      
      const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const monthsOfYear = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
      
      const dayOfWeek = daysOfWeek[dateObj.getDay()];
      const dayOfMonth = dateObj.getDate();
      const month = monthsOfYear[dateObj.getMonth()];
      const year = dateObj.getFullYear();
      
      return `${dayOfWeek} ${dayOfMonth} ${month} ${year}`;
    } catch (error) {
      console.error('Error in formatDateWithDay:', error);
      return String(date);
    }
  }

  // Generate bank transfer reference
  generateBankTransferReference(): string {
    return `TB-${this.tourId}-${Date.now().toString().substring(8)}`;
  }
  
  // Get payment method name for display
  getPaymentMethodName(): string {
    const methodId = this.paymentForm.get('paymentMethod')?.value;
    const method = this.paymentMethods.find(m => m.id === methodId);
    return method ? method.name : '';
  }
  
  // Navigate to next step
  nextStep(): void {
    if (this.currentStep === 1) {
      // Validate booking form
      if (this.bookingForm.invalid) {
        this.bookingForm.markAllAsTouched();
        return;
      }
      
      // Update participant count from form
      this.participantsCount = this.bookingForm.value.participants;
    } else if (this.currentStep === 2) {
      // Validate payment form
      if (this.paymentForm.invalid) {
        this.paymentForm.markAllAsTouched();
        return;
      }
    }
    
    this.currentStep++;
    window.scrollTo(0, 0);
  }
  
  // Go back to previous step
  previousStep(): void {
    this.currentStep--;
    window.scrollTo(0, 0);
  }
  
  // Confirm booking (final step)
  confirmBooking(): void {
    if (!this.termsAgreed) {
      this.error = 'Veuillez accepter les conditions générales pour continuer';
      setTimeout(() => this.error = '', 3000);
      return;
    }
    
    this.submitBooking();
  }
  
  // Implement missing prefillUserData method
  prefillUserData(): void {
    this.authService.getUser().subscribe({
      next: (user: any) => {
        if (user) {
          this.bookingForm.patchValue({
            firstName: user.prenom || user.firstName || '',
            lastName: user.nom || user.lastName || '',
            email: user.email || '',
            phone: user.telephone || user.phone || ''
          });
        }
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      }
    });
  }

  // Implement loadUserBookings method using getUserTours from the service
  loadUserBookings(): void {
    this.tourService.getUserTours().subscribe({
      next: (bookings) => {
        this.userBookings = bookings;
      },
      error: (err) => {
        console.error('Error fetching user bookings:', err);
      }
    });
  }

  // Cancel a booking
  cancelBooking(bookingId: string): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      this.loading = true;
      // Convert the bookingId to a number since the service method expects a number
      this.tourService.cancelTour(Number(bookingId)).subscribe({
        next: () => {
          this.toastr.success('Réservation annulée avec succès');
          // Reload bookings after cancellation
          this.loadUserBookings();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cancelling booking:', err);
          this.toastr.error('Erreur lors de l\'annulation de la réservation');
          this.loading = false;
        }
      });
    }
  }

  // Submit booking form
  submitBooking(): void {
    if (this.bookingForm.invalid) {
      this.toastr.error('Veuillez compléter tous les champs obligatoires');
      return;
    }

    this.submitting = true;
    
    // Create properly formatted booking data with all required fields
    const formValues = this.bookingForm.value;
    const paymentFormValues = this.paymentForm.value;
    
    const bookingData = {
      // Ensure date is explicitly formatted - this is the key fix
      booking_date: formValues.date,
      booking_time: formValues.time || '10:00', // Default time if not provided
      participants: formValues.participants,
      special_requirements: formValues.specialRequirements || '',
      // Format contact_info as JSON to match the backend expectation
      contact_info: {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        phone: formValues.phone
      },
      // Format payment_info as JSON to match the backend expectation
      payment_info: {
        method: paymentFormValues.paymentMethod,
        cardName: paymentFormValues.cardName,
        cardNumber: paymentFormValues.paymentMethod === 'creditCard' ? paymentFormValues.cardNumber : null,
        expiryDate: paymentFormValues.paymentMethod === 'creditCard' ? paymentFormValues.expiryDate : null,
        billingAddress: {
          address: paymentFormValues.address,
          city: paymentFormValues.city,
          postalCode: paymentFormValues.postalCode,
          country: paymentFormValues.country
        }
      },
      // Format pricing as JSON to match the backend expectation
      pricing: {
        basePrice: this.tour.price,
        participants: formValues.participants,
        subtotal: this.getTotalPrice(),
        discount: this.discountAmount,
        discountCode: this.promoCode,
        total: this.calculateTotal()
      }
    };
    
    if (!this.tourId) {
      this.toastr.error('ID de tour invalide');
      this.submitting = false;
      return;
    }
    
    console.log('Sending booking data:', bookingData);
    console.log('Tour ID:', this.tourId);
    
    // Convert tourId from string to number since that's what the service expects
    const numericTourId = parseInt(this.tourId, 10);
    
    // Pass the tourId as a number to the bookTour method
    this.tourService.bookTour(numericTourId, bookingData).subscribe({
      next: (response) => {
        console.log('Booking response:', response);
        this.bookingReference = response.bookingReference || response.id;
        this.bookingSuccessful = true;
        this.toastr.success('Réservation effectuée avec succès!');
        this.currentStep = 4; // Move to confirmation step
        this.submitting = false;
        this.loadUserBookings(); // Reload bookings after successful booking
      },
      error: (err) => {
        console.error('Error booking tour:', err);
        this.bookingError = true;
        this.errorMessage = err.error?.message || 'Erreur lors de la réservation du tour';
        this.toastr.error(this.errorMessage);
        this.submitting = false;
      }
    });
  }

  // Handle date selection
  selectDate(date: Date): void {
    this.selectedDate = date;
    this.bookingForm.patchValue({ date: date });
  }

  // Continue iteration handler
  handleContinueIteration(): void {
    this.continueIteration = true;
    this.router.navigate(['/tours']);
  }
  
  // Method to handle payment method selection
  selectPaymentMethod(method: string): void {
    this.paymentForm.get('paymentMethod')?.setValue(method);
  }
  
  // Methods for handling modals
  openTermsModal(event: Event): void {
    event.preventDefault();
    // You can implement actual modal functionality or just show an alert for now
    alert('Conditions générales: Cette fonctionnalité est en cours de développement.');
  }
  
  openPrivacyModal(event: Event): void {
    event.preventDefault();
    // You can implement actual modal functionality or just show an alert for now
    alert('Politique de confidentialité: Cette fonctionnalité est en cours de développement.');
  }
  
  // Navigation and UI methods
  viewBookings(): void {
    this.router.navigate(['/profil']);
  }
  
  goToHomePage(): void {
    this.router.navigate(['/']);
  }
  
  continueToNextIteration(): void {
    this.handleContinueIteration();
  }

  // Getter for easy access to form controls
  get f() { return this.bookingForm.controls; }
  get p() { return this.paymentForm.controls; }

  // Add/update the reloadPage method to work correctly
  reloadPage(): void {
    // Prevent automatic navigation to home page
    window.location.reload();
  }

  // Add/update goBack method to use Angular router
  goBack(): void {
    // Navigate back to the tour detail page if tourId exists
    if (this.tourId) {
      this.router.navigate(['/tours', this.tourId]);
    } else {
      this.router.navigate(['/tours']);
    }
  }
}
