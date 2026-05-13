import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { ProfileupdateService } from '../services/profileupdate.service';
import { UserModel } from '../models/user.model';
import { S3UrlPipe } from '../pipes/s3-url-pipe';
import { AuthService } from '../auth/auth.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Uploadservice } from '../services/uploadservice';
import { HttpClient } from '@angular/common/http';
import { Uploadimg } from '../uploadimg/uploadimg';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-profile',
  imports: [Navbar, S3UrlPipe, DatePipe, ReactiveFormsModule, Uploadimg, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private userService = inject(ProfileupdateService);
  private authService = inject(AuthService);
  editStatus = false;
  user: UserModel | null = null;
  profileForm = new FormGroup({
    username: new FormControl(''),
    info: new FormControl(''),
  });
  selectedFile: File | null = null;
  private uploadService = inject(Uploadservice);

  ngOnInit() {
    console.log('runataan profile oninit');
    this.getUser();
  }
  getUser() {
    this.userService.getUser().subscribe((data) => {
      this.user = data;
    });
  }
  logout() {
    this.authService.logout();
  }
  edit() {
    this.editStatus = !this.editStatus;
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
  onImageSelected(file: File) {
    this.selectedFile = file;
    console.log('File selected and ready to upload:', file.name);
  }

  removeImage() {
    if (confirm('Are you sure you want to delete your profile image?')) {
      this.userService.deleteProfileImage().subscribe({
        next: () => {
          console.log('Image deleted successfully');
          this.selectedFile = null;
          this.getUser(); // Reload user data so the image is removed from view
        },
        error: (err) => console.error('Error deleting image:', err),
      });
    }
  }

  private sendToBackend(finalData: any) {
    this.userService.updateUser(finalData).subscribe({
      next: () => {
        console.log('Profile saved!');
        this.editStatus = false;
        this.getUser();
      },
      error: (err) => console.error('Backend error', err),
    });
  }
}
