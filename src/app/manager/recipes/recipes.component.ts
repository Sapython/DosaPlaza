import { Component, OnInit } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';
import { RecipePageComponent } from './recipe-page/recipe-page.component';
import { LoaderComponent } from './loader/loader.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { DuplicateRecipeComponent } from './duplicate-recipe/duplicate-recipe.component';
import Fuse from 'fuse.js';


@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['../manager.util.scss', './recipes.component.scss'],
})
export class RecipesComponent implements OnInit {
  
  recipes: any[];
  filteredRecipes: any[] = [];
  noRecipe: boolean = false;
  recipesLoaded: boolean = false;
  recipeTypes: any[];
  ingredients: any;
  recipeLength: number = 0;
  lastDocReference: any;
  firstDocReference: any;
  lastEvent: any;
  serialNumberAdditionalCounter: number = 0;
  lastPaginatorEvent: any;
  pageSize:number = 10;
  constructor(
    private databaseService: DatabaseService,
    private alertService: AlertsAndNotificationsService,
    private dataProvider: DataProvider,
    public dialog: MatDialog
  ) {
    if (!window.localStorage.getItem('pageSize')) {
      window.localStorage.setItem('pageSize', '10');
    } else {
      this.pageSize = Number(window.localStorage.getItem('pageSize'));
    }
  }

  async ngOnInit(): Promise<void> {
    // Get ingredients
    await this.getSiteData();
    this.pageSize = Number(window.localStorage.getItem('pageSize'));
    await this.getRecipes();
    // this.manageCategory()
  }

  async getCurrentStocks() {
    if (!this.dataProvider.ingredientsCopy) {
      await this.databaseService.getFirstStock(500).then((stock: any) => {
        this.ingredients = {};
        stock.forEach((stockItem: any) => {
          this.ingredients[stockItem.id] = stockItem.data();
          this.ingredients[stockItem.id].id = stockItem.id;
        });
        console.log(this.ingredients);
      });
    } else {
      return;
    }
  }

  async getRecipeTypes() {
    await this.databaseService
      .getRecipeTypes()
      .then((recipeTypes: any) => {
        this.recipeTypes = [];
        recipeTypes.forEach((recipeType: any) => {
          this.recipeTypes.push({
            id: recipeType.id,
            ...recipeType.data(),
          });
        });
      })
      .catch((error) => {
        this.alertService.presentToast('Cannot get recipe types.', 'error');
      });
  }

  async getRecipes() {
    this.dataProvider.pageSetting.blur = true;
    await this.databaseService
      .getFirstRecipes(this.pageSize)
      .then((recipes: any) => {
        this.recipesLoaded = true;
        // recipes = []
        if (recipes.length === 0) {
          this.noRecipe = true;
        } else {
          this.noRecipe = false;
          this.recipes = [];
          this.setCurrentViewData(recipes);
        }
        // this.setCurrentViewData(recipes);
        this.dataProvider.pageSetting.blur = false;
      })
      .catch(() => {
        this.alertService.presentToast('Cannot get recipes.', 'error');
      });
  }

  async getNextRecipes(event: any) {
    this.lastEvent = event;
    this.lastPaginatorEvent = event;
    console.log(event);
    this.pageSize = event.pageSize;
    window.localStorage.setItem('pageSize', JSON.stringify(this.pageSize));
    if (event.previousPageIndex < event.pageIndex) {
      console.log('Moved next');
      const lastDoc = this.lastDocReference;
      const length = event.pageSize;
      this.serialNumberAdditionalCounter = event.pageIndex * event.pageSize;
      this.databaseService.getNextRecipes(length, lastDoc).then((docs: any) => {
        // this.allStocks.push(...docs)
        this.setCurrentViewData(docs);
      });
    } else if (event.previousPageIndex > event.pageIndex) {
      this.serialNumberAdditionalCounter = event.pageIndex * event.pageSize;
      this.databaseService
        .getPreviousRecipes(event.pageSize, this.firstDocReference)
        .then((docs: any) => {
          // this.allStocks.push(...docs)
          this.setCurrentViewData(docs);
        });
    } else if (
      event.previousPageIndex === event.pageIndex &&
      event.pageIndex === 0
    ) {
      this.serialNumberAdditionalCounter = event.pageIndex * event.pageSize;
      this.databaseService.getFirstRecipes(event.pageSize).then((docs: any) => {
        this.setCurrentViewData(docs);
        // this.allStocks.push(...docs)
      });
    }
    console.log(
      event.previousPageIndex,
      (event.pageIndex + 1) * event.pageSize
    );
  }

  setCurrentViewData(docs: DocumentReference[]) {
    this.recipes = [];
    let setFirstDoc = true;
    docs.forEach((doc: any) => {
      if (setFirstDoc) {
        this.firstDocReference = doc;
        setFirstDoc = false;
      }
      this.recipes.push({ ...doc.data(), id: doc.id });
      this.lastDocReference = doc;
    });
  }

  async getSiteData() {
    await this.databaseService
      .getSiteData()
      .then((data) => {
        if (data.exists()) {
          const siteData = data.data();
          this.recipeLength = siteData['recipeLength'];
        } else {
          this.recipeLength = 0;
        }
      })
      .catch((error) => {
        this.alertService.presentToast('Cannot get site data.', 'error');
      });
  }

  async checkAndGetData() {
    console.log(
      'Checking data',
      this.ingredients,
      this.recipeTypes,
      this.ingredients === undefined,
      this.recipeTypes === undefined
    );
    if (this.ingredients === undefined) {
      await this.getCurrentStocks();
    }
    if (this.recipeTypes === undefined) {
      await this.getRecipeTypes();
    }
  }
  addRecipe() {
    const loaderRef = this.dialog.open(LoaderComponent);
    this.checkAndGetData().then(() => {
      loaderRef.close();
      const dialogRef = this.dialog.open(AddRecipeComponent, {
        data: {
          ingredients: this.ingredients,
          ingredientsKeys: Object.keys(this.ingredients),
          recipeTypes: this.recipeTypes,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log('result', result);
        if (this.lastPaginatorEvent) {
          this.getNextRecipes(this.lastPaginatorEvent);
        } else {
          this.getRecipes();
        }
      });
    });
  }
  deleteRecipe(recipeId: string) {
    console.log('Deleting recipe', recipeId);
    if (confirm('Are you sure')) {
      this.dataProvider.pageSetting.blur = true;
      this.databaseService
        .deleteRecipe(recipeId)
        .then(() => {
          this.alertService.presentToast('Recipe deleted', 'info');
          if (this.lastPaginatorEvent) {
            this.getNextRecipes(this.lastPaginatorEvent);
          } else {
            this.getRecipes();
          }
          this.dataProvider.pageSetting.blur = false;
        })
        .catch(() => {
          this.dataProvider.pageSetting.blur = false;
          this.alertService.presentToast('Cannot delete recipe', 'error');
        });
    }
  }
  async editRecipe(recipeData: any) {
    // this.dataProvider.pageSetting.blur = true;
    const loaderRef = this.dialog.open(LoaderComponent);
    if (!this.ingredients) {
      await this.getCurrentStocks();
    }
    if (!this.recipeTypes) {
      await this.getRecipeTypes();
    }
    const dialogRef = this.dialog.open(EditRecipeComponent, {
      data: {
        recipeData: recipeData,
        ingredients: this.ingredients,
        ingredientsKeys: Object.keys(this.ingredients),
        recipeTypes: this.recipeTypes,
      },
    });
    loaderRef.close();
    dialogRef.afterClosed().subscribe((result) => {
      console.log('result', result);
      if (this.lastPaginatorEvent) {
        this.getNextRecipes(this.lastPaginatorEvent);
      } else {
        this.getRecipes();
      }
      // this.dataProvider.pageSetting.blur = false;
    });
  }
  async duplicateRecipe(recipeData: any) {
    // this.dataProvider.pageSetting.blur = true;
    const loaderRef = this.dialog.open(LoaderComponent);
    if (!this.ingredients) {
      await this.getCurrentStocks();
    }
    if (!this.recipeTypes) {
      await this.getRecipeTypes();
    }
    const dialogRef = this.dialog.open(DuplicateRecipeComponent, {
      data: {
        recipeData: recipeData,
        ingredients: this.ingredients,
        ingredientsKeys: Object.keys(this.ingredients),
        recipeTypes: this.recipeTypes,
      },
    });
    loaderRef.close();
    dialogRef.afterClosed().subscribe((result) => {
      console.log('result', result);
      if (this.lastPaginatorEvent) {
        this.getNextRecipes(this.lastPaginatorEvent);
      } else {
        this.getRecipes();
      }
      // this.dataProvider.pageSetting.blur = false;
    });
  }
  viewRecipe(recipe: any) {
    console.log({
      recipeId: recipe.id,
    });
    const dialogRef = this.dialog.open(RecipePageComponent, {
      data: recipe,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('result', result);
    });
  }
  manageCategory() {
    const dialogRef = this.dialog.open(ManageCategoryComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log('result', result);
    });
  }

  searched(event){
    const query = event.target.value.trim()
    if (query.length > 0) {
      const options = { keys: ['name'] };
      const fuse = new Fuse(this.recipes, options);
      const results = fuse.search(query);
      this.filteredRecipes = [];
      results.forEach((result) => {
        this.filteredRecipes.push(result.item);
      });
    } else {
      this.filteredRecipes =[];
    }
    

  }
}
