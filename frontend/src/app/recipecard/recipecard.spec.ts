import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recipecard } from './recipecard';

describe('Recipecard', () => {
  let component: Recipecard;
  let fixture: ComponentFixture<Recipecard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recipecard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recipecard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
