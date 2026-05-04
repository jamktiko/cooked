import { Component } from '@angular/core';
import { Recipecard } from '../recipecard/recipecard';
import { Navbar } from '../navbar/navbar';
import { Uploadimg } from '../uploadimg/uploadimg';

@Component({
  selector: 'app-frontpage',
  imports: [Recipecard, Navbar, Uploadimg],
  templateUrl: './frontpage.html',
  styleUrl: './frontpage.css',
})
export class Frontpage {

}
