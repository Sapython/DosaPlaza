import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateRecipeComponent } from './duplicate-recipe.component';

describe('DuplicateRecipeComponent', () => {
  let component: DuplicateRecipeComponent;
  let fixture: ComponentFixture<DuplicateRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuplicateRecipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
