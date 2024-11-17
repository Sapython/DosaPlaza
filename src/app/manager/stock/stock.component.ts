import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
declare const UIkit: any;
import Fuse from 'fuse.js';
import { Subscription } from 'rxjs';
import { DataProvider } from 'src/app/providers/data.provider';
import { BlurSiteService } from 'src/app/services/blur-site.service';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { VoiceRecognitionService } from 'src/app/services/voice-recognition.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['../manager.util.scss', './stock.component.scss'],
})
export class StockComponent implements OnInit {
  items: any[];
  filteredItems: any[];
  units: any[];
  currentValue: string = '0.00';
  currentDeleteId: string = '';
  allStocks: any[] = [];
  @ViewChild('itemSearchInput') itemSearchInput: ElementRef;
  @ViewChild('itemModal') itemModal: ElementRef;
  editMode: boolean = false;
  currentEditId: any = '';
  updateStockEnabled: boolean = false;
  serialNumberAdditionalCounter: number = 0;
  itemForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    unit: new UntypedFormControl('', [Validators.required]),
    quantity: new UntypedFormControl(0, [Validators.required]),
    rate: new UntypedFormControl(0, [Validators.required]),
  });
  stockLength: number = 0;
  updateStockFormControls: any = {};
  updateStockForm: UntypedFormGroup = new UntypedFormGroup(this.updateStockFormControls);
  lastDocReference: any;
  firstDocReference: any;
  editedItem: any = {};
  lastPaginatorEvent:any;
  recognizedText: string = '';
  recognitionEditType: string = 'quantity';
  currentRecognizedId:string = '';
  recognitionActive: boolean = false;
  recognizerSubscription:Subscription = new Subscription();
  pageSize:number = 10;
  constructor(
    private databaseService: DatabaseService,
    private dataProvider:DataProvider,
    private alertService: AlertsAndNotificationsService,
    public dialog: MatDialog,
    private routerSnapshot:ActivatedRoute,
    private voiceRecognitionService: VoiceRecognitionService
  ) {
    if (!window.localStorage.getItem('stockPageSize')) {
      window.localStorage.setItem('stockPageSize', '10');
    } else {
      this.pageSize = Number(window.localStorage.getItem('stockPageSize'));
    }
  }

  ngOnInit(): void {
    // Get stock items
    this.getInitialStock();
    this.getMeasuringUnits();
  }

  getInitialStock() {
    this.serialNumberAdditionalCounter = 0;
    this.databaseService
      .getSiteData()
      .then((data) => {
        if (data.exists()) {
          const siteData = data.data();
          this.stockLength = siteData['stockLength'];
        } else {
          this.stockLength = 0;
        }
      })
      .finally(() => {
        this.databaseService.getFirstStock(this.pageSize).then((docs: any) => {
          this.setCurrentViewData(docs);
          // this.allStocks.push(...docs)
        });
      })
      .catch((error) => {
        this.alertService.presentToast(error, 'error');
      });
  }

  getMeasuringUnits() {
    this.databaseService
      .getUnits()
      .then((units: any) => {
        this.units = units;
      })
      .catch((error) => {
        this.alertService.presentToast(error, 'error');
      });
  }

  setCurrentViewData(docs: DocumentReference[]) {
    this.items = [];
    let setFirstDoc = true;
    docs.forEach((doc: any) => {
      if (setFirstDoc) {
        this.firstDocReference = doc;
        setFirstDoc = false;
      }
      this.items.push({ id: doc.id, ...doc.data() });
      this.lastDocReference = doc;
    });
  }

  calculateCurrentValue() {
    const quantityInput = document.getElementById(
      'quantity-input'
    ) as HTMLInputElement;
    const quantity = parseFloat(quantityInput.value);
    const rateInput = document.getElementById('rate-input') as HTMLInputElement;
    const rate = parseFloat(rateInput.value);
    const currentValue = quantity * rate;
    this.currentValue = currentValue.toFixed(2);
  }

  getNextStocks(event: any) {
    // const lastDoc =
    this.lastPaginatorEvent = event;
    console.log(event);
    this.pageSize = event.pageSize;
    window.localStorage.setItem('stockPageSize', JSON.stringify(this.pageSize));
    if (event.previousPageIndex < event.pageIndex) {
      console.log('Moved next');
      const lastDoc = this.lastDocReference;
      const length = event.pageSize;
      this.serialNumberAdditionalCounter = (event.pageIndex) * event.pageSize
      this.databaseService.getNextStock(length, lastDoc).then((docs: any) => {
        // this.allStocks.push(...docs)
        this.setCurrentViewData(docs);
      });
    } else if (event.previousPageIndex > event.pageIndex) {
      this.serialNumberAdditionalCounter = (event.pageIndex) * event.pageSize
      this.databaseService.getPreviousStock(event.pageSize, this.firstDocReference).then((docs: any) => {
        // this.allStocks.push(...docs)
        this.setCurrentViewData(docs);
      })
    } else if (event.previousPageIndex === event.pageIndex && event.pageIndex === 0) {
      this.serialNumberAdditionalCounter = (event.pageIndex) * event.pageSize
      this.databaseService.getFirstStock(event.pageSize).then((docs: any) => {
        this.setCurrentViewData(docs);
        // this.allStocks.push(...docs)
      });
    }
    console.log(
      event.previousPageIndex,
      (event.pageIndex + 1) * event.pageSize
    );
  }

  changeStock(stock: any,event:any) {
    // console.log(event);
    this.items.forEach((item: any) => {
      if (item.id == stock.id){
        stock['quantity'] = parseFloat(event.target.value);
        this.editedItem[stock.id] =stock;
      }
    })
  }
  changeRate(stock: any,event:any){
    this.items.forEach((item: any) => {
      if (item.id == stock.id){
        stock['rate'] = parseFloat(event.target.value);
        this.editedItem[stock.id] = stock;
      }
    })
  }
  // Form Management
  submit(): void {
    if (this.itemForm.valid) {
      this.dataProvider.pageSetting.blur = true;
      if (this.editMode) {
        this.itemForm.value['rate'] = parseFloat(this.itemForm.value['rate']);
        this.databaseService
          .updateStockItem(this.currentEditId, this.itemForm.value)
          .then(() => {
            UIkit.modal(document.getElementById('item-modal')).hide();
            if(this.lastPaginatorEvent){
              this.getNextStocks(this.lastPaginatorEvent);
            } else {
              this.getInitialStock();
            }
            this.dataProvider.pageSetting.blur = false;;
            this.alertService.presentToast('Item edited successfully', 'info');
          });
      } else {
        this.itemForm.value['rate'] = parseFloat(this.itemForm.value['rate']);
        this.databaseService
          .addStockItem(this.itemForm.value)
          .then(() => {
            UIkit.modal(document.getElementById('item-modal')).hide();
            this.itemForm.reset();
            if(this.lastPaginatorEvent){
              this.getNextStocks(this.lastPaginatorEvent);
            } else {
              this.getInitialStock();
            }
            this.dataProvider.pageSetting.blur = false;;
            this.alertService.presentToast('Item added successfully', 'info');
          })
          .catch((error) => {
            this.alertService.presentToast(error.message, 'error');
          });
      }
    } else {
      this.alertService.presentToast(
        'Please fill all the required fields.',
        'error'
      );
    }
  }
  // Item actions
  editItem(item: any): void {
    this.editMode = true;
    this.currentEditId = item.id;

    // Patch values
    this.itemForm.patchValue(item);

    const itemModal = document.getElementById('item-modal');
    if (itemModal) {
      itemModal.addEventListener('hidden', () => {
        this.editMode = false;
        this.currentEditId = '';

        // Reset the form
        this.itemForm.reset();
      });
      UIkit.modal(itemModal).show();
      this.calculateCurrentValue();
    }
  }
  get currentUnit(){
    return this.itemForm.get('unit');
  }
  deleteItem(): void {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.deleteStockItem(this.currentDeleteId).then(() => {
      if(this.lastPaginatorEvent){
        this.getNextStocks(this.lastPaginatorEvent);
      } else {
        this.getInitialStock();
      }
      this.dataProvider.pageSetting.blur = false;;
      this.alertService.presentToast('Item deleted successfully', 'info');
    });
  }

  async updateStock(): Promise<void> {
    // Update only those items' stock whose inputs have been changed
    this.updateStockEnabled = false;
    for (const key in this.editedItem) {
      if (Object.prototype.hasOwnProperty.call(this.editedItem, key)) {
        const item = this.editedItem[key];
        if (item.quantity != item.oldQuantity) {
          try{
            await this.databaseService.updateStockItem(item.id, item)
          } catch(error:any){
            this.alertService.presentToast(error, 'error');
            return
          }
        }
      }
    }
    if(this.lastPaginatorEvent){
      this.getNextStocks(this.lastPaginatorEvent);
    } else {
      this.getInitialStock();
    }
    this.alertService.presentToast('Stock updated successfully', 'info');
  }

  // Search management
  searchItems(): void {
    const query = this.itemSearchInput.nativeElement.value.trim();
    if (query.length > 0) {
      const options = { keys: ['name'] };
      const fuse = new Fuse(this.items, options);
      const results = fuse.search(query);
      this.filteredItems = [];
      results.forEach((result) => {
        this.filteredItems.push(result.item);
      });
    } else {
      this.filteredItems = this.items;
    }
  }
  stopRecognition(){
    this.items.forEach((item: any) => {
      if(item['id'] == this.currentRecognizedId){
        item[this.recognitionEditType] = parseFloat(this.recognizedText);
        this.editedItem[item.id] = item;
      }
    })
    this.voiceRecognitionService.stop();
    this.recognizerSubscription.unsubscribe();
    this.recognitionActive = false;
  }

  startRecognition(itemId:string,type:'quantity'|'rate'): void {
    if (this.voiceRecognitionService.supported){
      this.recognitionEditType = type;
      this.currentRecognizedId = itemId;
      this.voiceRecognitionService.init();
      this.voiceRecognitionService.start();
      this.recognitionActive = true;
      this.recognizerSubscription = this.voiceRecognitionService.words.subscribe((data)=>{
        this.recognizedText = data;
      })
      this.alertService.presentToast('Listening...', 'info');    
      // setTimeout(()=>{
      //   this.voiceRecognitionService.stop();
      //   this.alertService.presentToast('Stopped Listening', 'info');    
      // },5000)
    }  else {
      this.alertService.presentToast(
        'Speech recognition is not supported in your browser','error'
      );
    }
  }
}
