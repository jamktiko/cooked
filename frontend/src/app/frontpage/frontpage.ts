import { Component } from '@angular/core';
import { Recipecard } from '../recipecard/recipecard';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-frontpage',
  imports: [Recipecard, Navbar],
  templateUrl: './frontpage.html',
  styleUrl: './frontpage.css',
})
export class Frontpage {

}
