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

@Component({
  selector: 'app-profile',
  imports: [Navbar, S3UrlPipe, DatePipe, ReactiveFormsModule, Uploadimg],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  private userService = inject(ProfileupdateService)
  private authService = inject(AuthService)
  editStatus = false
  user: UserModel | null = null;
    profileForm = new FormGroup({
    username: new FormControl(''),
    info: new FormControl(''),
  });
  selectedFile: File | null = null;
  private uploadService = inject(Uploadservice);

  ngOnInit(){
    console.log('runataan profile oninit')
    this.getUser()
  }
  getUser(){
    this.userService.getUser().subscribe((data) => {
      this.user = data
    })
  }
    logout() {
    this.authService.logout();
  }
  edit(){
    this.editStatus = !this.editStatus
  }
    onSubmit() {
    if (this.profileForm.invalid) return;

    // Jos kuva on valittu, ladataan se ensin S3:een
    if (this.selectedFile) {
      this.uploadService.uploadProcess(this.selectedFile, 'profiles').subscribe({
        next: (res) => {
          // lisätään profileForm valueihin mukaan backendistä saatu kuvan key
          const profileData = {
            ...this.profileForm.value,
            prof_picture: res.key,
          };
          this.sendToBackend(profileData);
        },
        error: (err) => console.error('Kuvan lataus epäonnistui', err),
      });
    } else {
      // Jos kuvaa ei valittu, lähetetään vain lomakkeen tiedot
      this.sendToBackend(this.profileForm.value);
    }
  }
  onImageSelected(file: File) {
    this.selectedFile = file;
    console.log('Tiedosto valittu ja valmiina ladattavaksi:', file.name);
  }

  removeImage() {
    if (confirm('Haluatko varmasti poistaa profiilikuvasi?')) {
      this.userService.deleteProfileImage().subscribe({
        next: () => {
          console.log('Kuva poistettu onnistuneesti');
          this.selectedFile = null;
          this.getUser(); // Lataa käyttäjän tiedot uudelleen jotta kuva poistuu näkyvistä
        },
        error: (err) => console.error('Kuvan poistossa tapahtui virhe:', err),
      });
    }
  }

  private sendToBackend(finalData: any) {
    this.userService.updateUser(finalData).subscribe({
      next: () => {
        console.log('Profiili valmis!');
        this.editStatus = false;
        this.getUser();
      },
      error: (err) => console.error('Backend-virhe', err),
    });
  }
}
