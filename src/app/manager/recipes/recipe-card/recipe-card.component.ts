import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
})
export class RecipeCardComponent implements OnInit {
  windowWidth:number = window.innerWidth;
  @Input() recipe: any;
  @Input() serialNumber: number;
  @Output() requestEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() requestDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() viewRecipe: EventEmitter<any> = new EventEmitter<any>();
  @Output() requestDuplicate: EventEmitter<any> = new EventEmitter<any>();
  loaded: boolean = false;
  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
  }
}
