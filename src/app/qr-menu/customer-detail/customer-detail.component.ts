import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataProvider } from 'src/app/providers/data.provider';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerDetailComponent implements OnInit {
  cartItems:number = 0;
  constructor(public dataProvider:DataProvider,private router:Router,private alertify:AlertsAndNotificationsService) { }
  customerDetailForm:FormGroup = new FormGroup({
    name: new FormControl(localStorage.getItem('name'),[Validators.required]),
    email: new FormControl(localStorage.getItem('email'),[Validators.required,Validators.email]),
    phone: new FormControl(localStorage.getItem('phone'),[Validators.required,Validators.pattern('^[0-9]*$')]),
    notes: new FormControl(localStorage.getItem('notes')),
  })
  showOrderDescription:boolean = false;
  finalProducts:any[] = [];
  finalSum:number = 0;
  ngOnInit(): void {
    console.log(this.dataProvider.qrProducts)
    this.dataProvider.qrProducts.forEach((item)=>{
      this.finalSum += item.onlinePrice;
      this.cartItems += 1;
      this.finalProducts.forEach((finalItem)=>{
        console.log('finalItem',finalItem.id,item.id,finalItem.id == item.id)
        if (finalItem.id == item.id){
          item.quantity += 1;
        } else {
          this.finalProducts.push({...item,quantity:1});
        }
      })
      if (this.finalProducts.length == 0){
        this.finalProducts.push({...item,quantity:1});
      }
    })
    console.log("finalProducts",this.finalProducts)
  }
  confirmOrder(){
    console.log(this.customerDetailForm.value);
    if (!this.showOrderDescription){
      localStorage.setItem('name',this.customerDetailForm.value.name);
    localStorage.setItem('email',this.customerDetailForm.value.email);
    localStorage.setItem('phone',this.customerDetailForm.value.phone);
    localStorage.setItem('notes',this.customerDetailForm.value.notes);
    localStorage.setItem('cartItems',this.cartItems.toString());
    this.dataProvider.qrCustomerData = this.customerDetailForm.value;
    if (this.customerDetailForm.valid){
      this.router.navigate(['../qr/placed'])
      this.showOrderDescription = true;
    } else {
      this.alertify.presentToast('Please fill all the fields')
    }
    } else {
      this.router.navigate(['../qr/placed'])
    }
  }

}
