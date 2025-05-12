import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GuideService } from '../../core/services/guide.service';
import { AuthService } from '../../core/services/auth.service';
import { TourService } from '../../core/services/tour.service';

@Component({
  selector: 'app-publish-tour',
  templateUrl: './publish-tour.component.html',
  styleUrls: ['./publish-tour.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PublishTourComponent implements OnInit {
  tourForm!: FormGroup; // Removing the "!" to initialize it immediately
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  isLoading = true; // Add a loading flag

  constructor(
    private formBuilder: FormBuilder,
    private tourService: TourService,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form right away in the constructor
    this.initForm();
  }

  ngOnInit(): void {
    // Use refreshUserData to get the latest user data
    this.authService.refreshUserData().subscribe(
      (user: any) => {
        console.log('User data in publish-tour (refreshed):', user);
        this.isLoading = false;
        
        if (!user) {
          console.log('No user found, redirecting to login');
          this.router.navigate(['/connexion']);
          return;
        }
        
        console.log('User role:', user.role);
        
        if (user.role !== 'guide') {
          console.log('User is not a guide, redirecting to become-guide');
          this.router.navigate(['/become-guide']);
          return;
        }
        
        console.log('User is a guide, staying on publish-tour page');
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Error getting user data:', error);
        this.errorMessage = 'Vous devez être connecté en tant que guide pour publier un tour.';
        // Remove the automatic redirect to connection page
        // Just show the error message instead
      }
    );
  }

  initForm(): void {
    // Get tomorrow's date for the minimum date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    this.tourForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      location: ['', Validators.required],
      duration: [2, [Validators.required, Validators.min(0.5)]],
      price: [25, [Validators.required, Validators.min(0)]],
      maxParticipants: [10, [Validators.required, Validators.min(1)]],
      date: [tomorrow.toISOString().split('T')[0], Validators.required],
      meetingPoint: ['', Validators.required],
      included: [''],
      notIncluded: [''],
      requirements: ['']
    });
  }

  onSubmit(): void {
    if (this.tourForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.tourForm.controls).forEach(key => {
        this.tourForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Use the form values directly - we don't need to get guide ID separately
    // as the backend will handle that based on the authenticated user
    const tourData = this.tourForm.value;

    this.tourService.createTour(tourData).subscribe(
      (response: any) => {
        console.log('Tour created successfully:', response);
        this.isSubmitting = false;
        this.successMessage = 'Votre tour a été publié avec succès!';
        
        // Reset form
        this.tourForm.reset();
        this.initForm();
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      (error: any) => {
        console.error('Error creating tour:', error);
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la publication du tour. Veuillez réessayer.';
      }
    );
  }
}