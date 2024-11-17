import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @Input() categoryName:string;
  @Input() images:string[];
  @Input() name:string;
  @Input() quantity:number;
  @Input() price:any;
  @Input() description:string;
  @Input() id:string;
  @Input() vegetarian:boolean = true;
  @Output() addToCart:EventEmitter<any> = new EventEmitter();
  @Output() showDetail:EventEmitter<any> = new EventEmitter();
  cartQuantityValue : number;
  fullSize:boolean=true;
  constructor() { }
  addToCartTrigger(this:any){
    //console.log(this)
    let data = {
      productid : this.id,
      name : this.name,
      price : this.isNumber(this.price) ? this.price : (this.fullSize ? this.price.full : this.price.half),
      description : this.description,
      image : this.images[0],
      quantity : this.cartQuantityValue || 1
    }
    console.log(data)
    this.addToCart.emit(data);
  }
  showDetailTrigger(){
    this.showDetail.emit(this);
  }
  ngOnInit(): void {
    var regexp = /-/gi;
    this.name=this.toTitleCase(this.name.replace(regexp,' '))
  }
  cartQuantityCheck(event){
    console.log(event)
    this.cartQuantityValue = event;
  }
  isNumber(value:any){
    return typeof value === 'number';
  }
  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
}
