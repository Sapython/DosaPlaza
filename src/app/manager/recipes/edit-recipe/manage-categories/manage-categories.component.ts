import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.scss'],
})
export class ManageCategoriesComponent implements OnInit {
  constructor(
    private databaseService: DatabaseService,
    @Inject(MAT_DIALOG_DATA) public category: any
  ) {}
  categories: any[] = [];
  ngOnInit(): void {
    console.log('this.category', this.category);
    this.databaseService.getNewCategories().subscribe((docs: any) => {
      this.categories = [];
      docs.forEach((doc: any) => {
        let subcategories: any[] = [];
        if (doc.data().subcategories) {
          doc.data().subcategories.forEach((element: any) => {
            subcategories.push({
              completed: false,
              title: element,
            });
          });
        }
        console.log(doc.data());
        this.categories.push({
          title: doc.data().title,
          id: doc.id,
          subcategories: subcategories,
        });
      });
      this.category.forEach((existingCategory: any) => {
        console.log('existingCategory', existingCategory);
        this.categories.forEach((category) => {
          if (category.id == existingCategory.id) {
            category.subcategories.forEach((subcategory: any) => {
              existingCategory.subcategories.forEach((existingSubcategory: any) => {
                if (subcategory.title == existingSubcategory.title) {
                  subcategory.completed = true;
                }
              });
            });
          }
        });
      });
      console.log('this.categories', this.categories);
    });
  }
  isComplete(categoryId: string): boolean {
    var finalCompleted = false;
    this.categories.forEach((category) => {
      if (category.id == categoryId) {
        let completed = 0;
        category.subcategories.forEach((subcategory: any) => {
          if (subcategory.completed) {
            completed++;
          }
        });
        finalCompleted = completed == category.subcategories.length;
      }
    });
    return finalCompleted;
  }
  isSomeComplete(categoryId: string): boolean {
    var finalCompleted = false;
    var completed = 0;
    this.categories.forEach((category) => {
      if (category.id == categoryId) {
        category.subcategories.forEach((subcategory: any) => {
          if (subcategory.completed) {
            completed++;
          }
        });
        // finalCompleted = completed == category.subcategories.length
        finalCompleted =
          completed > 0 && completed < category.subcategories.length;
      }
    });
    return finalCompleted;
  }
  setAllComplete(categoryId: string, checked: boolean): void {
    this.categories.forEach((category) => {
      if (category.id == categoryId) {
        category.subcategories.forEach((subcategory: any) => {
          subcategory.completed = checked;
        });
      }
    });
  }
  updateAllComplete(categoryId: string): void {
    this.isComplete(categoryId);
  }
}
