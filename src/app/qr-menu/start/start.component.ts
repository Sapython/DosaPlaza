import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { DataProvider } from 'src/app/providers/data.provider';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  tableNo:number = 0;
  constructor(private activatedRouteSnapshot:ActivatedRoute,public dataProvider:DataProvider,private router:Router) {
    this.activatedRouteSnapshot.queryParams.subscribe(params => {
      console.log(params);
      this.tableNo = Number(params['table']);
      this.dataProvider.tableNo = this.tableNo;
    })
   }

  ngOnInit(): void {
    setTimeout(()=>{
      this.router.navigate(['../qr/menu']);
    },2000)
  }

}
