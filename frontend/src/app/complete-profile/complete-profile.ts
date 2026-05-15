import { Component, inject, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ProfileupdateService } from '../services/profileupdate.service';
import { Router } from '@angular/router';
import { Uploadimg } from '../uploadimg/uploadimg';
import { Uploadservice } from '../services/uploadservice';
import { AuthService } from '../auth/auth.service';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'app-complete-profile',
  imports: [Navbar, ReactiveFormsModule, Uploadimg],
  templateUrl: './complete-profile.html',
  styleUrl: './complete-profile.css',
})
export class CompleteProfile implements OnInit {
  private updateService = inject(ProfileupdateService);
  private router = inject(Router);
  private uploadService = inject(Uploadservice);
  private authService = inject(AuthService);
  selectedFile: File | null = null;
  user: UserModel | null = null;

  profileForm = new FormGroup({
    username: new FormControl(''),
    info: new FormControl(''),
  });

  ngOnInit() {
    this.updateService.getUser().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => console.error('Failed to get user data', err)
    });
  }

  onImageSelected(file: File) {
    this.selectedFile = file;
    console.log('Tiedosto valittu ja valmiina ladattavaksi:', file.name);
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    // If an image is selected, upload it to S3 first
    if (this.selectedFile) {
      this.uploadService.uploadProcess(this.selectedFile, 'profiles').subscribe({
        next: (res) => {
          // add the image key returned by the backend to the profileForm values
          const profileData = {
            username: this.profileForm.value.username?.trim() || this.user?.username,
            info: this.profileForm.value.info?.trim() || this.user?.info,
            prof_picture: res.key,
          };

          this.sendToBackend(profileData);
        },
        error: (err) => console.error('Image upload failed', err),
      });
    } else {
      // If no image was selected, send only the form fields and avoid overwriting with empty values
      const profileData = {
        username: this.profileForm.value.username?.trim() || this.user?.username,
        info: this.profileForm.value.info?.trim() || this.user?.info,
      };
      this.sendToBackend(profileData);
    }
  }

  private sendToBackend(finalData: any) {
    this.updateService.updateUser(finalData).subscribe({
      next: () => {
        console.log('Profile saved!');
        this.router.navigate(['/frontpage']);
      },
      error: (err) => console.error('Backend error', err),
    });
  }

  logout() {
    this.authService.logout();
  }
}
