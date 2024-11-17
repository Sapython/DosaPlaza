import { Component, Input, OnInit } from '@angular/core';
import { ProductsServiceService } from '../products-service.service';
import Swal from 'sweetalert2';
import jQuery from 'jquery';
import SwiperCore, {
  Autoplay,
  EffectFade,
  Pagination,
  SwiperOptions,
  Virtual,
} from 'swiper';
import 'swiper/css/bundle';
import { PaginationOptions } from 'swiper/types';
import { DatabaseService } from 'src/app/services/database.service';
import { Category } from 'src/app/structures/method.structure';
import { DataProvider } from 'src/app/providers/data.provider';
declare var $: any;
declare var jQuery: any;
declare var jquery: any;
SwiperCore.use([Virtual, Autoplay, EffectFade, Pagination]);

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  newArrivals: any = [];
  allProducts: any = [];
  newProducts: any = [];
  newProductsDocs: any = [];
  singleProductData: any;
  cartItems: number = 0;
  paginationConfig: PaginationOptions = {
    type: 'bullets',
  };
  allCategory: any[] = [];
  config: SwiperOptions = {
    slidesPerView: 5,
    loop: true,
    spaceBetween: 50,
    navigation: true,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    effect: 'coverflow',
    lazy: { loadPrevNext: true },
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    // Responsive breakpoints
    breakpoints: {
      '@0.00': {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      '@0.75': {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      '@1.00': {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      '@1.50': {
        slidesPerView: 5,
        spaceBetween: 30,
      },
    },
  };
  sliderConfig: SwiperOptions = {
    slidesPerView: 1,
    loop: true,
    centeredSlides: true,
    spaceBetween: 30,
    navigation: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    // Responsive breakpoints
    breakpoints: {
      '@0.00': {
        slidesPerView: 1,
        spaceBetween: 10,
        centeredSlides: true,
      },
      '@0.75': {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      '@1.00': {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      '@1.50': {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    },
  };
  bannerConfig: SwiperOptions = {
    slidesPerView: 4,
    loop: true,
    spaceBetween: 30,
    navigation: true,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    // Responsive breakpoints
    breakpoints: {
      '@0.00': {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      '@0.75': {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      '@1.00': {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      '@1.50': {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    },
  };
  featuredBannerSwiperConfig: SwiperOptions = {
    slidesPerView: 3,
    loop: true,
    spaceBetween: 30,
    navigation: true,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    breakpoints: {
      '@0.00': {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      '@0.75': {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      '@1.00': {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      '@1.50': {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    },
  };
  productsSliderConfig: SwiperOptions = {
    slidesPerView: 5,
    loop: true,
    spaceBetween: 15,
    navigation: true,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    // Responsive breakpoints
    breakpoints: {
      '@0.00': {
        slidesPerView: 1.15,
        spaceBetween: 10,
        centeredSlides: true,
      },
      '@0.75': {
        slidesPerView: 1.15,
        spaceBetween: 10,
        centeredSlides: true,
      },
      '@1.00': {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      '@1.50': {
        slidesPerView: 5,
        spaceBetween: 10,
      },
    },
  };
  featuredBanners = [
    {
      link: '',
      image: 'assets/uploads/banner/banner (1).jpeg',
      alt: '',
    },
    {
      link: '',
      image: 'assets/uploads/banner/banner (2).jpeg',
      alt: '',
    },
    {
      link: '',
      image: 'assets/uploads/banner/banner (3).jpeg',
      alt: '',
    },
    {
      link: '',
      image: 'assets/uploads/banner/banner (4).jpeg',
      alt: '',
    },
    {
      link: '',
      image: 'assets/uploads/banner/banner (5).jpeg',
      alt: '',
    },
  ];
  LoadCount:number = 3;
  categoryIndex:number = 0;
  showMore: boolean = false;
  loadingMore: boolean = false;
  siteData: any;
  constructor(
    private productService: ProductsServiceService,
    private databaseService: DatabaseService,
    public dataProvider: DataProvider
  ) {
    // this.getAllProducts();
  }

  ngOnInit(): void {
    //console.log(this.allProducts)
    // this.dataProvider.pageSetting.blur = true;
    // this.databaseService.getSingleCategories().then(async (res: any) => {
    //   if (res.data()){
    //     res.data().category.forEach((element) => {
    //       this.allCategory.push(element)
    //     })
    //   }
    //   await this.getNextProduct()
    // })
    this.databaseService.getSiteData().then((data)=>{
      console.log(data.data())
      this.siteData = data.data()
    })
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.getFirstCommerceRecipes(10).then((data:any)=>{
      this.newProducts = []
      data.forEach((doc)=>{
        this.newProducts.push({...doc.data(),id:doc.id})
        this.newProductsDocs.push(doc)
      })
      // this.getNextProduct()
    }).finally(()=>{
      this.dataProvider.pageSetting.blur = false;
    })
  }
  loadNewProducts(){
    console.log(this.newProductsDocs)
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.getNextCommerceRecipes(10,this.newProductsDocs[this.newProductsDocs.length-1]).then((data:any)=>{
      this.newProductsDocs = []
      data.forEach((doc)=>{
        this.newProducts.push({...doc.data(),id:doc.id})
        this.newProductsDocs.push(doc)
      })
      console.log(this.newProductsDocs)
      // this.getNextProduct()
    }).finally(()=>{
      this.dataProvider.pageSetting.blur = false;
    })
  }
  async getNextProduct(){
    this.loadingMore = true;
    this.showMore = false;
    if (this.categoryIndex < this.allCategory.length - 1) {
      if (this.categoryIndex+this.LoadCount <= this.allCategory.length) {
        for (let counter = this.categoryIndex+this.LoadCount;this.categoryIndex < counter; this.categoryIndex++) {
          await this.databaseService.getProductsByCategory(this.allCategory[this.categoryIndex]).then(res => {
            let products:any[] = []
            res.forEach((element:any) => {
              products.push(element.data())
            })
            this.allProducts.push({name:this.allCategory[this.categoryIndex],products:products})
          })
        }
        this.showMore = true;
        this.loadingMore = false;
        this.dataProvider.pageSetting.blur = false;
      }
    } else {
      this.showMore = false;
      this.loadingMore = false;
    }
    this.dataProvider.pageSetting.blur = false;
  }
  getProductData(data) {
    this.dataProvider.pageSetting.blur = true;
    this.singleProductData = data;
    $('#productSingleView').modal('show');
    this.dataProvider.pageSetting.blur = false;
    console.log("data",this.singleProductData)
  }
  addProductToCart(product: any) {
    console.log("product1",product)
    let productInfo = {
      productid : product.id,
      name : product.name,
      price : this.isNumber(product.price) ? product.price : Number(product.fullSize ? product.price.fullPlate : product.price.halfPlate),
      description : product.description,
      image : product.images,
      quantity : product.cartQuantityValue || 1
    }
    console.log("product",productInfo)
    if (product.productid != null) {
      this.databaseService.addToCart(product).then((res) => {
        console.log('res',res)
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Added to cart',
          showConfirmButton: false,
          timer: 1500,
        });
        this.cartItems = this.cartItems + 1;
      });
    }
  }
  productData: Category[] = [
    // {
    //   name:'Vegetarians',
    // }
  ];
  isNumber(value:any){
    return typeof value === 'number';
  }
}
