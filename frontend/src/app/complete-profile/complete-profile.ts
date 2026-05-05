import { Component, inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ProfileupdateService } from '../services/profileupdate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete-profile',
  imports: [Navbar, ReactiveFormsModule],
  templateUrl: './complete-profile.html',
  styleUrl: './complete-profile.css',
})


export class CompleteProfile {
  private updateService = inject(ProfileupdateService)
  private router = inject(Router);

  profileForm = new FormGroup({
    username: new FormControl(''),
    info: new FormControl('')
  })

  onSubmit(){
    console.log(this.profileForm.value)
    this.updateService.updateUser(this.profileForm.value).subscribe({
          next: (res) => {
          alert('Käyttäjän profiili päivitetty');
          // Ohjataan käyttäjä takaisin etusivulle onnistuneen tallennuksen jälkeen
          this.router.navigate(['/frontpage']);
        },
        error: (err) => {
          // Logataan virhe, jos tallennus epäonnistuu (esim. 401 tai 500 -virheet)
          console.error('error in updating profile:', err);
        },
    })
  }
}
