import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'profileImage',
  standalone: true
})
export class ProfileImagePipe implements PipeTransform {
  transform(imagePath: string | null | undefined): string {
    if (!imagePath) {
      return 'assets/images/default-profile.png';
    }

    // If the image path is just a filename (no slashes)
    if (!imagePath.includes('/')) {
      // Check if it's the default profile image
      if (imagePath === 'default-profile.png') {
        return 'assets/images/default-profile.png';
      }
      
      // If it's another image without a path, assume it's from the API
      // Use a safe access to environment.apiUrl with a fallback
      const apiBaseUrl = environment && environment.apiUrl ? environment.apiUrl : 'http://localhost:3002/api';
      return `${apiBaseUrl}/uploads/${imagePath}`;
    }
    
    // If it already starts with assets, http, or data:image, return as is
    if (imagePath.startsWith('assets/') || 
        imagePath.startsWith('/assets/') || 
        imagePath.startsWith('http') || 
        imagePath.startsWith('data:image')) {
      return imagePath;
    }
    
    // Otherwise, assume it's a relative path from the API
    // Use a safe access to environment.apiUrl with a fallback
    const apiBaseUrl = environment && environment.apiUrl ? environment.apiUrl : 'http://localhost:3002/api';
    return `${apiBaseUrl}/${imagePath}`;
  }
}