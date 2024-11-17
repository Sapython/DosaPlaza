import { Component, OnInit } from '@angular/core';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(private dataProvider : DataProvider, private databaseService : DatabaseService) { }
  orders:any[] = [];
  ngOnInit(): void {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.getUsers().then((res:any) => {
      res.forEach((user)=>{
        this.databaseService.getOrderForUser(user.id).then((userOrder:any) => {
          userOrder.forEach((data:any)=>{
            let orderData = data.data()
            orderData["id"] = data.id
            this.orders.push(orderData);
          })
          this.dataProvider.pageSetting.blur = false;
        })
      })
    })
  }
  getDate(data:any){
    return (new Date(data.seconds+data.nanoseconds)).toDateString();
  }
}
