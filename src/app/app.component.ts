import { Component, OnInit } from '@angular/core';
// import styles bundle
import { AuthencationService } from './services/authencation.service';
import { DataProvider } from './providers/data.provider';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Dosa Plaza Restaurant';
  constructor(public authService:AuthencationService, public dataProvider : DataProvider){
  }
  ngOnInit(): void{
  }
}
