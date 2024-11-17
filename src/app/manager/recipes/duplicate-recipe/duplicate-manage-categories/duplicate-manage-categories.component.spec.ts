import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateManageCategoriesComponent } from './duplicate-manage-categories.component';

describe('DuplicateManageCategoriesComponent', () => {
  let component: DuplicateManageCategoriesComponent;
  let fixture: ComponentFixture<DuplicateManageCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuplicateManageCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateManageCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
