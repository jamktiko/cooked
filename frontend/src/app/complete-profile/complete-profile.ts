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

    // Jos kuva on valittu, ladataan se ensin S3:een
    if (this.selectedFile) {
      this.uploadService.uploadProcess(this.selectedFile, 'profiles').subscribe({
        next: (res) => {
          // lisätään profileForm valueihin mukaan backendistä saatu kuvan key
          const profileData = {
            username: this.profileForm.value.username?.trim() || this.user?.username,
            info: this.profileForm.value.info?.trim() || this.user?.info,
            prof_picture: res.key,
          };

          this.sendToBackend(profileData);
        },
        error: (err) => console.error('Kuvan lataus epäonnistui', err),
      });
    } else {
      // Jos kuvaa ei valittu, lähetetään vain lomakkeen tiedot ja estetään tyhjien arvojen ylikirjoitus
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
        console.log('Profiili valmis!');
        this.router.navigate(['/frontpage']);
      },
      error: (err) => console.error('Backend-virhe', err),
    });
  }

  logout() {
    this.authService.logout();
  }
}
