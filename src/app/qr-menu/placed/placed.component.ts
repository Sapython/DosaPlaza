import { Component, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-placed',
  templateUrl: './placed.component.html',
  styleUrls: ['./placed.component.scss']
})
export class PlacedComponent implements OnInit {
  options: AnimationOptions = {
    path:'https://assets5.lottiefiles.com/datafiles/OhIfcxnkLsj1Jxj/data.json'
  };
  constructor() { }

  ngOnInit(): void {
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

}
