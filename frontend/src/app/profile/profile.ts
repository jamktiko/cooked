import { Component, inject, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { ProfileupdateService } from '../services/profileupdate.service';
import { UserModel } from '../models/user.model';
import { S3UrlPipe } from '../pipes/s3-url-pipe';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-profile',
  imports: [Navbar, S3UrlPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  private userService = inject(ProfileupdateService)
  private authService = inject(AuthService)
  user: UserModel | null = null;
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
}
