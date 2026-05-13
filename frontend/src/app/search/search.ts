import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  // Lähettää valmiin hakusanan isäntäkomponentille (esim. my-recipes.ts)
  @Output() searchQuery = new EventEmitter<string>();

  searchControl = new FormControl('');

  ngOnInit(): void {
    // Kuunnellaan hakukenttää
    this.searchControl.valueChanges.pipe(
      debounceTime(600), // Waits for the user to stop typing (600ms)
      distinctUntilChanged() // Lähettää tapahtuman vain, jos teksti on muuttunut
    ).subscribe(term => {
      // Send the term to the parent component without extra spaces
      this.searchQuery.emit((term || '').trim());
    });
  }
}