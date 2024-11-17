import { AuthencationService } from 'src/app/services/authencation.service';
import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collectionData,
  DocumentReference,
  FieldValue,
  CollectionReference,
  collection,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  docSnapshots,
  docData,
  getDoc,
  getDocs,
  query,
  where,
  collectionSnapshots,
  arrayUnion,
  arrayRemove,
} from '@angular/fire/firestore';
import { ContactRequest } from '../structures/user.structure';
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getStorage,
} from 'firebase/storage';
import { Product } from '../structures/method.structure';
import { DataProvider } from '../providers/data.provider';
import { Router } from '@angular/router';
import { DocumentSnapshot, endAt, increment, limit, limitToLast, orderBy, startAfter, Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  contactDoc: CollectionReference;
  feedbackDoc: CollectionReference;
  cartCollectionRef: CollectionReference;
  productCollectionRef: CollectionReference;
  deliveryAddressRef: CollectionReference;
  cartItemDocumentRef: DocumentReference;
  roomCollRef: CollectionReference;
  checkoutCollRef: CollectionReference;
  public id: any;
  storage = getStorage();
  constructor(
    private fs: Firestore,
    private AuthService: AuthencationService,
    private dataProvider: DataProvider,
    private router:Router
  ) {
    AuthService.getUser.subscribe((res) => {
      //console.log("data", res);
       this.id = res?.uid;
    });
    //this.id = this.dataProvider.userData;
    this.contactDoc = collection(this.fs, 'contactRequests');
    this.feedbackDoc = collection(this.fs, 'feedbacks');
  }
  addContactRequest(
    name: string,
    email: string,
    phoneNumber: string,
    message: string
  ) {
    let data: ContactRequest = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      message: message,
      date: new Date(),
    };
    addDoc(this.contactDoc, data).then((doc) => {
      console.log(doc);
      console.log(doc.id);
    });
  }

  getCartObservable() {
    //console.log("this.id",this.id)
    return collectionSnapshots(
      collection(this.fs, 'users/' + this.id + '/cart')
    );
  }
  getCart() {
    return getDocs(collection(this.fs, 'users/' + this.id + '/cart'));
  }
  login(){
    this.router.navigateByUrl('./sign-up');
  }
  async addToCart(data: any) {
    if (!this.dataProvider.loggedIn){this.login()}
    this.cartCollectionRef = collection(this.fs, 'users/' + this.id + '/cart');
    let returnResponse: any;
    let res = await this.getCart();
    console.log('Response', res);
    let found = false;
    let productUpdateId: string = '';
    let alreadyHaveQuantity: any = '';
    res.forEach((cartData: any) => {
      if (cartData.data().productid === data.productid) {
        found = true;
        productUpdateId = cartData.id;
        alreadyHaveQuantity = cartData.data().quantity;
      }
    });
    if (found) {
      console.log('Found', data);
      console.log(productUpdateId);
      return updateDoc(
        doc(this.fs, 'users/' + this.id + '/cart/' + productUpdateId),
        {
          quantity: alreadyHaveQuantity + data.quantity,
        }
      ).catch((err: any) => {
        console.log(err);
      });
    } else {
      console.log('Not found', data);
      return addDoc(this.cartCollectionRef, data);
    }
  }
  deleteCartProduct(id: string) {
    if (!this.dataProvider.loggedIn){this.login()}
    return deleteDoc(
      doc(this.fs, 'users/' + this.id + '/cart/' + id)
    );
  }
  getDeliveryAddress() {
    if (!this.dataProvider.loggedIn){this.login()}
    //console.log("this.id",this.id)
    return collectionSnapshots(
      collection(this.fs, 'users/' + this.id + '/delivery_addresses')
    );
  }
  addDeliveryAddress(data: any) {
    if (!this.dataProvider.loggedIn){this.login()}
    this.deliveryAddressRef = collection(
      this.fs,
      'users/' + this.id + '/delivery_addresses'
    );
    return addDoc(this.deliveryAddressRef, data);
  }
  deleteDeliveryAddress(id: string) {
    if (!this.dataProvider.loggedIn){this.login()}
    return deleteDoc(
      doc(this.fs, 'users/' + this.id + '/delivery_addresses/' + id)
    );
  }

  async addProduct(data: Product) {
    if (!this.dataProvider.loggedIn){this.login()}
    return addDoc(collection(this.fs, 'products'), data).then((document) => {
      return updateDoc(doc(this.fs, 'products/' + document.id), {
        id: document.id,
      });
    });
    //console.log(q)
  }
  deleteProduct(id: string) {
    if (!this.dataProvider.loggedIn){this.login()}
    return deleteDoc(doc(this.fs, 'products/' + id));
  }
  async addRoom(data: Product) {
    if (!this.dataProvider.loggedIn){this.login()}
    return addDoc(collection(this.fs, 'rooms'), data).then((document) => {
      return updateDoc(doc(this.fs, 'rooms/' + document.id), {
        id: document.id,
      });
    });
    //console.log(q)
  }
  getRoomsForAdminPanel() {
    if (!this.dataProvider.loggedIn){this.login()}
    return getDocs(collection(this.fs, 'rooms/'));
  }

  getRooms() {
    if (!this.dataProvider.loggedIn){this.login()}
    return collectionSnapshots(collection(this.fs, 'rooms/'));
  }
  updateCart(id, quantity) {
    if (!this.dataProvider.loggedIn){this.login()}
    //console.log(id,quantity, this.id)
    return updateDoc(doc(this.fs, 'users/' + this.id + '/cart/' + id), {
      quantity: quantity,
    }).catch((err: any) => {
      console.log(err);
    });
  }
  async emptyCart(){
    if (!this.dataProvider.loggedIn){this.login()}
    return await getDocs(collection(this.fs, 'users/' + this.id + '/cart')).then((res: any) => {
      res.forEach(async (cartData: any) => {
        return await deleteDoc(doc(this.fs, 'users/' + this.id + '/cart/' + cartData.id));
      });
    });
  }
  getVendors() {
    if (!this.dataProvider.loggedIn){this.login()}
    return getDocs(
      query(collection(this.fs, 'users'), where('access', '==', 'Vendor'))
    );
  }
  getCategories() {
    return docData(doc(this.fs, 'siteData/category'));
  }
  getSingleCategories(){
    return getDoc(doc(this.fs, 'siteData/category'));
  }
  addCategory(name: string) {
    if (!this.dataProvider.loggedIn){this.login()}
    return setDoc(
      doc(this.fs, 'siteData/category'),
      { category: arrayUnion(name) },
      { merge: true }
    );
  }
  deleteCategory(name: string) {
    if (!this.dataProvider.loggedIn){this.login()}
    return setDoc(
      doc(this.fs, 'siteData/category'),
      { category: arrayRemove(name) },
      { merge: true }
    );
  }
  getProducts() {
    return getDocs(collection(this.fs, '/business/accounts/b8588uq3swtnwa1t83lla9/recipes/recipes'));
  }
  getOccupiedRooms() {
    return getDoc(doc(this.fs, 'siteData/rooms'))
  }
  occupyRoom(roomNumber:string){
    return setDoc(doc(this.fs, 'siteData/rooms'), {occupiedRooms: arrayUnion(roomNumber)}, {merge: true});
  }
  async upload(path: string, file: File | null): Promise<any> {
    if (!this.dataProvider.loggedIn){this.login()}
    const ext = file!.name.split('.').pop();
    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        await task;
        const url = await getDownloadURL(storageRef);
        return url;
      } catch (e: any) {
        console.error(e);
        return false;
      }
    } else {
      // handle invalid file
      return false;
    }
  }
  addCommentById(id: string, data: any) {
    if (!this.dataProvider.loggedIn){this.login()}
    this.roomCollRef = collection(this.fs, 'rooms/' + id + '/comments');
    return addDoc(this.roomCollRef, data);
  }
  getCommentsOfRoom(id: string) {
    if (!this.dataProvider.loggedIn){this.login()}
    //console.log("this.id",this.id)
    return collectionSnapshots(
      collection(this.fs, 'rooms/' + id + '/comments')
    );
  }
  // CHECKOUT ORDERS ADD UPDATE Functions
  addCheckoutData(data: any) {
    if (!this.dataProvider.loggedIn){this.login()}
    console.log('addCheckoutData');
    this.checkoutCollRef = collection(this.fs, 'users/' + this.id + '/orders');
    return addDoc(this.checkoutCollRef, data);
  }
  addFeedback(name: string, email: string, comment: string) {
    let data: any = {
      name: name,
      email: email,
      message: comment,
      date: new Date(),
    };
    addDoc(this.feedbackDoc, data).then((doc) => {
      console.log(doc);
      console.log(doc.id);
    });
  }
  getFeedbacks() {
    return collectionSnapshots(collection(this.fs, 'feedbacks'));
  }
  async getProductsByCategory(category : string) {
    let q = query(collection(this.fs, 'products'), where("category", "==", category));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }
  deleteRoom(id: string) {
    return deleteDoc(
      doc(this.fs, 'rooms/' + id)
    );
  }
  getOrders() {
    return getDocs(collection(this.fs, 'users/' + this.id + '/orders'));
  }
  getUsers(){
    return getDocs(collection(this.fs, 'users'));
  }
  getOrderForUser(uid){
    return getDocs(collection(this.fs, 'users/' + uid + '/orders'));
  }
  async getCustomersListAdmin() {
    let q = query(collection(this.fs, 'users'), where("access", "==", "User"));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }
  getContactReq() {
    return getDocs(collection(this.fs, 'contactRequests/'));
  }
  getRoomData(id) {
    return getDoc(doc(this.fs, 'rooms/'+ id));
  }
  async updateRoom(data: Product) {
      return updateDoc(doc(this.fs, 'rooms/' + data.id), data);
    //console.log(q)
  }

  getSiteData() {
    // alert('Getting site data')
    return getDoc(doc(this.fs, 'siteData/counters'));
  }
  getFirstStock(length: number) {
    // alert('Getting first stock')
    return getDocs(
      query(collection(this.fs, 'stock'), orderBy('name'), limit(length))
    );
  }

  getNextStock(length: number, lastDocument: DocumentSnapshot) {
    // alert('Getting next stock')
    return getDocs(
      query(
        collection(this.fs, 'stock'),
        orderBy('name'),
        limit(length),
        startAfter(lastDocument)
      )
    );
  }
  getPreviousStock(length: number, firstDocument: DocumentSnapshot) {
    // alert('Getting previous stock')
    return getDocs(
      query(
        collection(this.fs, 'stock'),
        orderBy('name'),
        limitToLast(length),
        endAt(firstDocument)
      )
    );
  }

  async getUnits() {
    // alert('Getting units')
    const data = await getDoc(doc(this.fs, 'siteData/units'));
    if (data.exists()) {
      return data.data()?.['units'].sort();
    } else {
      return [];
    }
  }

  async addStockItem(stockItem: any) {
    // alert('Adding stock item')
    try {
      await addDoc(collection(this.fs, 'stock'), stockItem);
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        stockLength: increment(1),
      });
    } catch (e: any) {
      // console.error(e);
      throw new Error(e.toString());
    }
  }

  updateStockItem(stockId: string, stock: any) {
    // alert('Updating stock item')
    return updateDoc(doc(this.fs, 'stock/' + stockId), stock);
  }

  async deleteStockItem(stockId: string) {
    // alert('Deleting stock item')
    try {
      await deleteDoc(doc(this.fs, 'stock/' + stockId));
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        stockLength: increment(-1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  getFirstUtilities(length: number) {
    // alert('Getting first utility')
    return getDocs(
      query(collection(this.fs, 'utilities'), orderBy('name'), limit(length))
    );
  }

  getNextUtilities(length: number, lastDocument: DocumentSnapshot) {
    // alert('Getting next utilities')
    return getDocs(
      query(
        collection(this.fs, 'utilities'),
        orderBy('name'),
        limit(length),
        startAfter(lastDocument)
      )
    );
  }

  getPreviousUtilities(length: number, firstDocument: DocumentSnapshot) {
    // alert('Getting previous utilities')
    return getDocs(
      query(
        collection(this.fs, 'utilities'),
        orderBy('name'),
        limitToLast(length),
        endAt(firstDocument)
      )
    );
  }

  async addUtility(utility: any) {
    // alert('Adding utility')
    try {
      await addDoc(collection(this.fs, 'utilities'), utility);
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        utilityLength: increment(1),
      });
    } catch (e: any) {
      // console.error(e);
      throw new Error(e.toString());
    }
  }

  updateUtility(utilityId: string, utility: any) {
    // alert('Updating utility')
    return updateDoc(doc(this.fs, 'utilities/' + utilityId), utility);
  }

  async deleteUtility(utilityId: string) {
    // alert('Deleting utility')
    try {
      await deleteDoc(doc(this.fs, 'utilities/' + utilityId));
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        utilityLength: increment(-1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  getRecipe(recipeId: any) {
    // alert('Getting recipe')
    return getDoc(doc(this.fs, 'recipes/' + recipeId));
  }

  getAllRecipes() {
    return getDocs(query(collection(this.fs, 'recipes'), orderBy('name')));
  }

  getFirstRecipes(length: number) {
    // alert('Getting first recipes')
    return getDocs(
      query(collection(this.fs, 'recipes'), orderBy('name'), limit(length))
    );
  }

  getFirstCommerceRecipes(length: number) {
    // alert('Getting first recipes')
    return getDocs(
      query(collection(this.fs, 'recipes'), orderBy('finalPrice'), where('finalPrice','>',0), limit(length))
    );
  }

  getNextRecipes(length: number, lastDocument: DocumentSnapshot) {
    // alert('Getting next recipes')
    return getDocs(
      query(
        collection(this.fs, 'recipes'),
        orderBy('name'),
        limit(length),
        startAfter(lastDocument)
      )
    );
  }

  getNextCommerceRecipes(length: number, lastDocument: DocumentSnapshot) {
    // alert('Getting next recipes')
    return getDocs(
      query(
        collection(this.fs, 'recipes'),
        orderBy('finalPrice'),
        limit(length),
        where('finalPrice', '>', 0),
        startAfter(lastDocument)
      )
    );
  }

  getPreviousRecipes(length: number, firstDocument: DocumentSnapshot) {
    // alert('Getting previous recipes')
    return getDocs(
      query(
        collection(this.fs, 'recipes'),
        orderBy('name'),
        limitToLast(length),
        endAt(firstDocument)
      )
    );
  }

  getRecipeTypes() {
    // alert('Getting recipe types')
    return getDocs(query(collection(this.fs, 'recipeTypes'), orderBy('name')));
  }

  async addRecipe(recipe: any) {
    // alert('Adding recipe')
    try {
      await addDoc(collection(this.fs, 'recipes'), recipe);
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        recipeLength: increment(1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  editRecipe(recipeId: string, recipe: any) {
    // alert('Editing recipe')
    return updateDoc(doc(this.fs, 'recipes/' + recipeId), recipe);
  }

  async deleteRecipe(recipeId: string) {
    // alert('Deleting recipe')
    try {
      await deleteDoc(doc(this.fs, 'recipes/' + recipeId));
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        recipeLength: increment(-1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  getTasks() {
    // alert('Getting tasks')
    return getDocs(query(collection(this.fs, 'tasks'), orderBy('timestamp')));
  }

  getEmployees() {
    // alert('Getting employees')
    return getDocs(query(collection(this.fs, 'employees'), orderBy('name')));
  }

  async addTask(task: any) {
    // alert('Adding task')
    try {
      task['completed'] = false;
      task['timestamp'] = Timestamp.now();
      await addDoc(collection(this.fs, 'tasks'), task);
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        tasksLength: increment(1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  editTask(taskId: string, task: any) {
    // alert('Editing task')
    return updateDoc(doc(this.fs, 'tasks/' + taskId), task);
  }

  async deleteTask(taskId: string) {
    // alert('Deleting task')
    try {
      await deleteDoc(doc(this.fs, 'tasks/' + taskId));
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        tasksLength: increment(-1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  async addEmployee(employee: any) {
    // alert('Adding employee')
    try {
      await addDoc(collection(this.fs, 'employees'), employee);
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        employeeLength: increment(1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  editEmployee(employeeId: string, employee: any) {
    // alert('Editing employee')
    return updateDoc(doc(this.fs, 'employees/' + employeeId), employee);
  }

  getEmployee(employeeId: string) {
    // alert('Getting employee')
    return getDoc(doc(this.fs, 'employees/' + employeeId));
  }

  async deleteEmployee(employeeId: string) {
    // alert('Deleting employee')
    try {
      await deleteDoc(doc(this.fs, 'employees/' + employeeId));
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        employeeLength: increment(-1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  getCustomers() {
    // alert('Getting customers')
    return getDocs(query(collection(this.fs, 'customers'), orderBy('name')));
  }

  async addCustomer(customer: any) {
    // alert('Adding customer')
    try {
      await addDoc(collection(this.fs, 'customers'), customer);
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        customerLength: increment(1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  editCustomer(customerId: string, customer: any) {
    // alert('Editing customer')
    return updateDoc(doc(this.fs, 'customers/' + customerId), customer);
  }

  getCustomer(customerId: string) {
    // alert('Getting customer')
    return getDoc(doc(this.fs, 'customers/' + customerId));
  }

  async deleteCustomer(customerId: string) {
    // alert('Deleting customer')
    try {
      await deleteDoc(doc(this.fs, 'customers/' + customerId));
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        customerLength: increment(1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }
   // Utility management starts
   getUtilities(){
    return getDocs(collection(this.fs,'stockUtilities'));
  }
  // Utility management ends

  getAnalytics(month: number, year: number) {
    return getDoc(
      doc(this.fs, 'analytics/' + month.toString() + year.toString())
    );
  }

  addPieAnalytics(data:any,pieData:any){
    setDoc(doc(this.fs, 'analytics/graphs'), {pieLabels:data,pieData:pieData}, {merge: true});
  }

  getGraphAnalytics(){
    return getDoc(doc(this.fs, 'analytics/graphs'));
  }

  addBarAnalytics(data:any,barData:any){
    setDoc(doc(this.fs, 'analytics/graphs'), {barLabels:data,barData:barData}, {merge: true});
  }
  // categories
  getNewCategories() {
    return collectionSnapshots(collection(this.fs, 'categories'));
  }
  addNewCategory(category: any) {
    return addDoc(collection(this.fs, 'categories'), category);
  }
  deleteNewCategory(categoryId: string) {
    return deleteDoc(doc(this.fs, 'categories/' + categoryId));
  }
  addNewSubcategory(subcategory: any,categoryId:string) {
    return updateDoc(doc(this.fs, 'categories/'+categoryId), {subcategories: arrayUnion(subcategory)});
  }
  deleteNewSubcategory(subcategory: string,categoryId:string) {
    return updateDoc(doc(this.fs, 'categories/'+categoryId), {subcategories: arrayRemove(subcategory)});
  }
}
