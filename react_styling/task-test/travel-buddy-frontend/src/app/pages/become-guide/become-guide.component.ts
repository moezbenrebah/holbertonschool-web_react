import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { GuideService } from '../../core/services/guide.service';

@Component({
  selector: 'app-become-guide',
  templateUrl: './become-guide.component.html',
  styleUrls: ['./become-guide.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class BecomeGuideComponent implements OnInit {
  guideForm: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private guideService: GuideService,
    private router: Router
  ) {
    this.guideForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      location: ['', Validators.required],
      specialites: ['', Validators.required],
      langues: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      phone: ['', Validators.pattern('^[0-9]{10}$')]
    });
  }

  ngOnInit(): void {
    // Check if user is already a guide
    this.authService.getUser().subscribe((user: any) => {
      if (user?.role === 'guide') {
        // If user is already a guide, redirect to publish tour page
        this.router.navigate(['/publish-tour']);
      }
    });
  }

  onSubmit(event?: any): void {
    event?.preventDefault(); // Prevent default form submission
    
    if (this.guideForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const guideData = this.guideForm.value;
    
    console.log('Submitting guide data:', guideData);
    
    // Call API to create guide profile
    this.guideService.createGuideProfile(guideData).subscribe({
      next: (response: any) => {
        console.log('Guide profile created:', response);
        this.isSubmitting = false;
        
        // Use the new refreshUserData method to get completely fresh user data
        this.authService.refreshUserData().subscribe({
          next: (user: any) => {
            console.log('User data refreshed after becoming guide:', user);
            // Now redirect to the publish tour page
            this.router.navigate(['/publish-tour']);
          },
          error: (err) => {
            console.error('Error refreshing user data:', err);
            // Try to redirect anyway
            this.router.navigate(['/publish-tour']);
          }
        });
      },
      error: (error: any) => {
        console.error('Error creating guide profile:', error);
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la création du profil de guide.';
      }
    });
  }
}