import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TourService } from '../../core/services/tour.service';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-edit-tour',
  templateUrl: './edit-tour.component.html',
  styleUrls: ['./edit-tour.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class EditTourComponent implements OnInit {
  tourForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  isLoading = true;
  tour: any = null;
  tourId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private tourService: TourService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Get the tour ID from the route parameters
    this.route.params.subscribe(params => {
      this.tourId = params['id'];
      console.log('Route params:', params);
      console.log('Tour ID from route:', this.tourId);
      
      if (!this.tourId) {
        this.errorMessage = 'ID du tour non trouvé';
        this.isLoading = false;
        return;
      }
      
      // Load tour data
      this.loadTourData();
    });
  }

  loadTourData(): void {
    console.log('Loading tour data for ID:', this.tourId);
    
    this.tourService.getTourById(this.tourId).subscribe(
      (response: any) => {
        console.log('Tour data loaded:', response);
        this.isLoading = false;
        
        if (!response || !response.tour) {
          this.errorMessage = 'Tour non trouvé ou vous n\'avez pas l\'autorisation de le modifier.';
          return;
        }
        
        this.tour = response.tour;
        this.populateForm(this.tour);
      },
      (error) => {
        this.isLoading = false;
        console.error('Error loading tour:', error);
        this.errorMessage = 'Une erreur est survenue lors du chargement du tour.';
      }
    );
  }

  initForm(): void {
    this.tourForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      location: ['', Validators.required],
      duration: [2, [Validators.required, Validators.min(0.5)]],
      price: [25, [Validators.required, Validators.min(0)]],
      maxParticipants: [10, [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      meetingPoint: ['', Validators.required],
      included: [''],
      notIncluded: [''],
      requirements: ['']
    });
  }

  populateForm(tour: any): void {
    console.log('Populating form with tour data:', tour);
    
    // Format the date to YYYY-MM-DD for the input field
    let formattedDate = '';
    if (tour.date) {
      const date = new Date(tour.date);
      formattedDate = date.toISOString().split('T')[0];
    }
    
    this.tourForm.patchValue({
      title: tour.title,
      description: tour.description,
      location: tour.location,
      duration: tour.duration,
      price: tour.price,
      maxParticipants: tour.maxParticipants,
      date: formattedDate,
      meetingPoint: tour.meetingPoint,
      included: tour.included,
      notIncluded: tour.notIncluded,
      requirements: tour.requirements
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

    const tourData = this.tourForm.value;
    console.log('Submitting tour update with data:', tourData);

    this.tourService.updatePublishedTour(this.tourId, tourData).subscribe(
      (response: any) => {
        console.log('Tour updated successfully:', response);
        this.isSubmitting = false;
        this.successMessage = 'Votre tour a été mis à jour avec succès!';
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      (error: any) => {
        console.error('Error updating tour:', error);
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la mise à jour du tour. Veuillez réessayer.';
      }
    );
  }
}