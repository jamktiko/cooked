import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRecipes } from './my-recipes';

describe('MyRecipes', () => {
  let component: MyRecipes;
  let fixture: ComponentFixture<MyRecipes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRecipes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRecipes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
