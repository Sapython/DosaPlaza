import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-duplicate-manage-categories',
  templateUrl: './duplicate-manage-categories.component.html',
  styleUrls: ['./duplicate-manage-categories.component.scss']
})
export class DuplicateManageCategoriesComponent implements OnInit {
  constructor(private databaseService:DatabaseService) { }
  categories:any[] = []
  ngOnInit(): void {
    this.databaseService.getNewCategories().subscribe((docs:any)=>{
      this.categories = []
      docs.forEach((doc:any) => {
        let subcategories:any[] = []
        doc.data().subcategories.forEach((element) => {
          subcategories.push({
            completed:false,
            title:element
          })
        });
        console.log(doc.data());
        this.categories.push({
          title:doc.data().title,
          id:doc.id,
          subcategories:subcategories
        })
      });
    })
  }
  isComplete(categoryId):boolean{
    var finalCompleted = false;
    this.categories.forEach(category =>{
      if (category.id == categoryId){
        let completed = 0;
        category.subcategories.forEach(subcategory =>{
          if (subcategory.completed){
            completed++
          }
        })
        finalCompleted = completed == category.subcategories.length
      }
    })
    return finalCompleted
  }
  isSomeComplete(categoryId):boolean{
    var finalCompleted = false;
    var completed = 0;
    this.categories.forEach(category =>{
      if (category.id == categoryId){
        category.subcategories.forEach(subcategory =>{
          if (subcategory.completed){
            completed++
          }
        })
        // finalCompleted = completed == category.subcategories.length
        finalCompleted = completed > 0 && completed < category.subcategories.length
      }
    })
    return finalCompleted
  }
  setAllComplete(categoryId,checked:boolean):void{
    this.categories.forEach(category =>{
      if (category.id == categoryId){
        category.subcategories.forEach(subcategory =>{
          subcategory.completed = checked
        })
      }
    })
  }
  updateAllComplete(categoryId):void{
    this.isComplete(categoryId)
  }
}
