import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';
import { DuplicateManageCategoriesComponent } from './duplicate-manage-categories/duplicate-manage-categories.component';


@Component({
  selector: 'app-duplicate-recipe',
  templateUrl: './duplicate-recipe.component.html',
  styleUrls: ['./duplicate-recipe.component.scss']
})
export class DuplicateRecipeComponent implements OnInit {
  constructor(
    private alertService: AlertsAndNotificationsService,
    @Inject(MAT_DIALOG_DATA) public recipe: any,
    private matDialogRef: MatDialogRef<AddRecipeComponent>,
    private databaseService:DatabaseService,
    private dialog:MatDialog,
    private dataProvider:DataProvider
  ) {}
  selectedCategories:any[] = []
  // Constants
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Variables
  utilities:any[] = [];
  files: File[];
  cookingCost: number = 0;
  sellingPrice: number = 0;
  costPercentage: string = '1';
  recipeIngredients: any[] = [];
  servingInstructions: any[] = [];
  cookingInstructions: any[] = [];
  cookingInstructionsForm =  new UntypedFormGroup({})
  servingInstructionsForm = new UntypedFormGroup({})
  // Forms
  recipeForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(this.recipe.recipeData.name,[Validators.required]),
    photos: new UntypedFormControl([],[]),
    finalPrice: new UntypedFormControl(this.recipe.recipeData.finalPrice),
    type: new UntypedFormControl(this.recipe.recipeData.type || ''),
    flavourPalette: new UntypedFormControl(this.recipe.recipeData.flavourPalette || ''),
    bestSeasonFrom: new UntypedFormControl(this.recipe.recipeData.bestSeasonFrom || ''),
    bestSeasonTo: new UntypedFormControl(this.recipe.recipeData.bestSeasonTo || ''),
    description: new UntypedFormControl(this.recipe.recipeData.description || ''),
    ingredients: new UntypedFormControl(this.recipe.recipeData.ingredients || ''),
    cookingInstructions:this.cookingInstructionsForm,
    servingInstructions: this.servingInstructionsForm,
    preparationTimeValue: new UntypedFormControl(this.recipe.recipeData.preparationTimeValue || ''),
    preparationTimeUnit: new UntypedFormControl(this.recipe.recipeData.preparationTimeUnit || ''),
    cookingTimeValue: new UntypedFormControl(this.recipe.recipeData.cookingTimeValue || ''),
    cookingTimeUnit: new UntypedFormControl(this.recipe.recipeData.cookingTimeUnit || ''),
    servingTimeValue: new UntypedFormControl(this.recipe.recipeData.servingTimeValue || ''),
    servingTimeUnit: new UntypedFormControl(this.recipe.recipeData.servingTimeUnit || ''),
    shelfLifeValue: new UntypedFormControl(this.recipe.recipeData.shelfLifeValue || ''),
    shelfLifeUnit: new UntypedFormControl(this.recipe.recipeData.shelfLifeUnit || ''),
    flameThrow:new UntypedFormControl(this.recipe.recipeData.flameThrow,[]),
    energyConsumptionPerPreparation: new UntypedFormControl(this.recipe.recipeData.energyConsumptionPerPreparation || ''),
  });
  ngAfterViewInit() {
    setTimeout(() => {this.calculateCost();this.checkForCalculation()},3000)
  }
  removePhoto(index){
    this.recipe.recipeData.photos.splice(index,1);
  }
  ngOnInit(): void {
    console.log(this.recipe, this.recipe.recipeTypes);
    this.recipeIngredients = [];
    this.databaseService.getUtilities().then((docs:any)=>{
      docs.forEach((element:any) => {
        this.utilities.push(element.data());
      });
    })
    this.recipe.recipeData.ingredients.forEach((ingredient: any) => {
      const sel = new UntypedFormControl(JSON.stringify(ingredient.id),[Validators.required]);
      const val =  new UntypedFormControl(ingredient.quantity || 0,[Validators.required]);
      this.recipeIngredients.push({
        ingredientSelector: sel,
        ingredientValue: val,
        unit:ingredient.unit
      });
      val.setValue(ingredient.quantity || 0);
      sel.setValue(JSON.stringify(ingredient.id));
    });
    console.log(this.recipeIngredients);
    this.recipe.recipeData.cookingInstructions?.forEach((instruction: any) => {
      const control = new UntypedFormControl(instruction);
      this.cookingInstructions.push({instruction:control});
      this.cookingInstructionsForm.addControl(this.cookingInstructions.length.toString()+'cookingInstruction',control);
    });
    this.recipe.recipeData.servingInstructions?.forEach((instruction: any) => {
      const control = new UntypedFormControl(instruction);
      this.servingInstructions.push({instruction:control});
      this.servingInstructionsForm.addControl(this.cookingInstructions.length.toString()+'servingInstruction',control);
    });
    this.recipeForm.controls['finalPrice'].setValue(this.recipe.recipeData.finalPrice);
    this.cookingCost = this.recipe.recipeData.cookingCost
    this.sellingPrice = this.recipe.recipeData.sellingPrice
    this.selectedCategories = this.recipe.recipeData.selectedCategories;
    if (this.recipe.recipeData.costPercentage !== undefined){
      this.costPercentage = this.recipe.recipeData.costPercentage; 
    } else {
      this.alertService.presentToast('Cost percentage is not defined. Defaulting to 1');
      this.costPercentage = '1';
    }
  }
  getIngredient(ingredient: any) {
    // console.log('ingredient',ingredient);
    if (ingredient.ingredientSelector.value){
      return this.recipe.ingredients[JSON.parse(ingredient.ingredientSelector.value)];
    }
  }
  calculateCost(){
    // console.log("Calculating cost");
    this.cookingCost = 0;
    this.recipeIngredients.some((control: any) => {
      console.log(control);
      if (this.getIngredient(control)){
        this.cookingCost += parseFloat(this.getIngredient(control).rate) * parseFloat(control['ingredientValue'].value);
      }
    });
    // console.log('1 Percent:',(this.cookingCost / 100),'CPercent:',this.costPercentage,this.cookingCost+((this.cookingCost / 100)*parseInt(this.costPercentage)));
    this.sellingPrice = Math.ceil(((this.cookingCost* 100)/parseInt(this.costPercentage)));
    // console.log("Calculated cost");
  }
  checkForCalculation(){
    if (this.recipeForm.value.cookingTimeUnit && this.recipeForm.value.cookingTimeValue && this.recipeForm.value.flameThrow){
      this.calculateEnergyConsumption();
    }
  }
  getLpgData():any{
    const data = this.utilities.find((value:any,index:number)=>{if (value.name==='LPG'){return true} else {return false}});
    return data;
  }
  calculateEnergyConsumption(){
    function getCookingTime(recipeForm:any):number{
      if(recipeForm.get('cookingTimeUnit').value=='minutes'){
        return recipeForm.get('cookingTimeValue').value*60;
      } else if (recipeForm.get('cookingTimeUnit').value=='hours'){
        return recipeForm.get('cookingTimeValue').value*60*60;
      } else if (recipeForm.get('cookingTimeUnit').value=='days'){
        return recipeForm.get('cookingTimeValue').value*60*60*24;
      } else {
        return 0;
      }
    }
    if (this.recipeForm.value.cookingTimeValue){
      const offset = -2;
      this.recipeForm.controls['energyConsumptionPerPreparation'].setValue(Math.ceil(( getCookingTime(this.recipeForm)) * (2/parseFloat(this.recipeForm.value.flameThrow))) + offset);
      console.log('Value',this.recipeForm.value.energyConsumptionPerPreparation);
      return this.recipeForm.value.energyConsumptionPerPreparation;
    } else {
      return 0;
    }
  }
  async submit() {
    this.calculateCost();
    console.log(this.recipeForm.value);
    if (this.recipeForm.valid) {
      this.dataProvider.pageSetting.blur = true;
      console.log("Valid",this.servingInstructions,this.cookingInstructions);
      let servingInstructions: string[] = [];
      this.servingInstructions.forEach((control:{instruction:UntypedFormControl}) => {
        servingInstructions.push(control.instruction.value);
      });
      let cookingInstructions: string[] = [];
      this.cookingInstructions.forEach((control: {instruction:UntypedFormControl}) => {
        cookingInstructions.push(control.instruction.value);
      });
      let recipeIngredients: any[] = [];
      this.recipeIngredients.forEach((control: any) => {
        console.log(control);
        const data = this.getIngredient(control)
        console.log(data);
        recipeIngredients.push({
          id: data.id,
          unit: data.unit,
          quantity: control.ingredientValue.value,
          ingredientSelector: control.ingredientSelector.value,
          ingredientValue: control.ingredientValue.value,
        });
      });
      
      let photos:any[] = [];
      if(this.files){
        for (let index = 0; index < this.files.length; index++) {
          const file = this.files[index];
          const path = `recipes/${this.recipeForm.value.name}/${file.name}`;
          photos.push(await this.databaseService.upload(path, file));
          console.log(photos);
        }
        this.recipeForm.value.photos = photos;
      } else {
        if (!this.recipe.recipeData.photos){
          this.alertService.presentToast('Please add at least one photo','error');
          return
        }
      }
      const recipe = {
        ...this.recipe.recipeData,
        ...this.recipeForm.value,
        photos:this.recipe.recipeData.photos ? this.recipe.recipeData.photos.concat(photos) : photos,
        cookingCost: this.cookingCost,
        sellingPrice: this.sellingPrice,
        ingredients: recipeIngredients,
        costPercentage:this.costPercentage,
        finalPrice: this.recipeForm.value.finalPrice || 0,
        cookingInstructions: cookingInstructions,
        servingInstructions: servingInstructions,
        selectedCategories:this.selectedCategories || []
      };
      console.log('Recipe final data ',recipe);
      this.databaseService.addRecipe(recipe).then(() => {
        this.alertService.presentToast('Recipe added successfully','info');
        this.matDialogRef.close();
        this.dataProvider.pageSetting.blur = false;
      }).catch((error) => {
        this.dataProvider.pageSetting.blur = false;
        this.alertService.presentToast('Error adding recipe: '+error.message,'error');
      });
    } else {
      this.alertService.presentToast('Please fill all the required fields','error');
    }
  }
  getString(value: any) {
    return JSON.stringify(value);
  }
  getObject(value: string) {
    return JSON.parse(value);
  }
  validateImages(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files != null) {
      for (var i = 0; i < files!.length; i++) {
        const file = files![i];
        var fileIsValid = false;
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
          this.alertService.presentToast(
            'Only png, jpeg and jpg images are allowed',
            'error'
          );
        } else if (file.size >= 500_000_000) {
          this.alertService.presentToast(
            "Each image's size must be less than 100Kb",
            'error'
          );
        } else {
          fileIsValid = true;
          this.files = Array.from(files);
        }
        if (!fileIsValid) {
          target.value = '';
        }
      }
    }
  }
  log(data: any) {
    console.log(data);
  }
  addIngredient() {
    this.recipeIngredients.push({
      ingredientSelector: new UntypedFormControl('',[Validators.required]),
      ingredientValue: new UntypedFormControl('',[Validators.required]),
    });
    this.calculateCost();
  }
  deleteIngredient(index: number) {
    this.recipeIngredients.splice(index, 1);
  }
  addInstruction(type: 'serving' | 'cooking') {
    if (type === 'serving') {
      const control = new UntypedFormControl('',[Validators.required]); 
      this.servingInstructions.push({instruction:control});
      this.servingInstructionsForm.addControl(this.cookingInstructions.length.toString()+'servingInstruction',control);
    } else {
      const control = new UntypedFormControl('',[Validators.required]);
      this.cookingInstructions.push({instruction:control});
      this.cookingInstructionsForm.addControl(this.cookingInstructions.length.toString()+'cookingInstruction',control);
    }
  }

  deleteInstruction(type: 'serving' | 'cooking', index: number) {
    if (type === 'serving') {
      this.servingInstructions.splice(index, 1);
      this.servingInstructionsForm.removeControl(index+'servingInstruction');
    } else {
      this.cookingInstructions.splice(index, 1);
      this.cookingInstructionsForm.removeControl(index+'cookingInstruction');
    }
  }
  manageCategories() {
    console.log("this.recipe.recipeData",this.recipe.recipeData)
    const dialogRef = this.dialog.open(DuplicateManageCategoriesComponent,{
      data:this.recipe.recipeData.selectedCategories
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      console.log('result', result);
      this.selectedCategories = result;
      this.alertService.presentToast('Categories updated successfully','info');
    });
  }
}
