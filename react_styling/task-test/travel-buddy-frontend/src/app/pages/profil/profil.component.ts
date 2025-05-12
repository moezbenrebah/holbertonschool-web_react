import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, User } from '../../services/auth.service'; // Use the main AuthService
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
  animations: [
    // Define your animations here if any
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ]
})
export class ProfilComponent implements OnInit {
  profileForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  originalFormValues: any = {};
  profileImageUrl: SafeStyle = '';
  imageFile: File | null = null;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profileImage: ['']
    });
  }

  ngOnInit(): void {
    // Use the main AuthService's user$ observable
    this.authService.user$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.profileForm.patchValue({
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          profileImage: user.profileImage
        });
        this.originalFormValues = this.profileForm.value;
        this.updateProfileImagePreview(user.profileImage);
      } else {
        this.router.navigate(['/connexion']);
      }
    });
  }

  updateProfileImagePreview(imageUrl: string): void {
    if (imageUrl) {
      this.profileImageUrl = this.sanitizer.bypassSecurityTrustStyle(`url('${imageUrl}')`);
    } else {
      this.profileImageUrl = this.sanitizer.bypassSecurityTrustStyle(`url('/assets/images/default-profile.png')`);
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        this.updateProfileImagePreview(imageUrl);
        
        // We'll handle the actual upload when the form is submitted
        // For now, we'll store the file and not update the form's profileImage field
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  resetForm(): void {
    this.profileForm.reset(this.originalFormValues);
    this.updateProfileImagePreview(this.originalFormValues.profileImage);
    this.imageFile = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    const formData = new FormData();
    
    // Add form fields to FormData
    Object.keys(this.profileForm.value).forEach(key => {
      formData.append(key, this.profileForm.value[key]);
    });
    
    // If there's a selected file, add it to FormData
    if (this.imageFile) {
      formData.append('profileImageFile', this.imageFile);
    }

    // Use your main AuthService's update method with FormData
    this.authService.updateProfile(formData).subscribe({
      next: (response) => {
        this.successMessage = 'Profile updated successfully!';
        this.errorMessage = '';
        this.originalFormValues = this.profileForm.value;
        
        // If the server returns an updated user with a new image URL, update the preview
        if (response.user?.profileImage) {
          this.updateProfileImagePreview(response.user.profileImage);
        }
        
        // Reset the file input
        this.imageFile = null;
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.errorMessage = err.error?.message || 'Failed to update profile.';
        this.successMessage = '';
      }
    });
  }

  // Add this new method to let users become admins (for development purposes only)
  becomeAdmin(): void {
    if (!this.currentUser) return;
    
    // Create a copy of the current user with admin role
    const updatedUser = {
      ...this.currentUser,
      role: 'admin'
    };
    
    // In a real app, this would be an API call
    // For this demo, we'll modify the local storage directly
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update the current user in the auth service
    this.authService['userSubject'].next(updatedUser);
    
    this.successMessage = 'You are now an admin! You can access the admin dashboard.';
    this.errorMessage = '';
  }
}
