import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRecipeDetail } from './my-recipe-detail';

describe('MyRecipeDetail', () => {
  let component: MyRecipeDetail;
  let fixture: ComponentFixture<MyRecipeDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRecipeDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRecipeDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
