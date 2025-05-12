import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuideService } from '../../core/services/guide.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guide-profile',
  templateUrl: './guide-profile.component.html',
  styleUrls: ['./guide-profile.component.css'],
  standalone: true,
  imports: [CommonModule] // Add CommonModule here
})
export class GuideProfileComponent implements OnInit {
  guideId: string = '';
  guide: any = null;

  constructor(private route: ActivatedRoute, private guideService: GuideService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.guideId = params['id'];
      this.loadGuideProfile();
    });
  }

  loadGuideProfile(): void {
    this.guideService.getGuideProfile(this.guideId).subscribe({
      next: (data) => {
        this.guide = data;
      },
      error: (err) => {
        console.error('Error loading guide profile:', err);
      }
    });
  }
}
