import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  constructor(
    public dataProvider: DataProvider,
    private databaseService: DatabaseService,
    private alertify: AlertsAndNotificationsService,
    private router:Router
  ) {}
  products: any[] = [];
  categories: any[] = [];
  ngOnInit(): void {
    this.databaseService.getProducts().then((docs: any) => {
      docs.forEach((doc: any) => {
        this.products.push({ ...doc.data(), id: doc.id });
        // if !(this.categories.includes(doc.data().categories.id))
        this.categories.filter(
          (category: any) => category.id == doc.data().categories.id
        ).length == 0
          ? this.categories.push(doc.data().categories)
          : null;
      });
      console.log(this.products, this.categories);
    });
  }

  filterRecipes(category: string) {
    return this.products.filter(
      (product: any) => product.categories.id == category
    );
  }

  addToCart(product) {
    this.dataProvider.qrProducts.push(product);
    this.alertify.presentToast('Added to cart');
  }

  continueToCheckout() {
    if (this.dataProvider.qrProducts.length == 0) {
      this.alertify.presentToast('Please add some products to cart');
      return;
    }
    this.router.navigate(['../qr/customerDetail']);
  }
}
