import { DataProvider } from 'src/app/providers/data.provider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth, browserLocalPersistence } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { AuthencationService } from './services/authencation.service';
import { DatabaseService } from './services/database.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './users/layouts/material/material.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { EmailBasedDialogComponent } from './models/login/email-based-dialog/email-based-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EnsureAuthenticated } from './services/ensure-authenticated.service';
import { EnsureAdminService } from './services/ensure-admin.service';
import { EnsureVendorService } from './services/ensure-vendor.service';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PaymentService } from './services/payment.service';
import { BlurSiteService } from './services/blur-site.service';
import { setPersistence } from 'firebase/auth';
import { LottieModule } from 'ngx-lottie';

export function playerFactory() {
  return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}

@NgModule({
  declarations: [
    AppComponent,
    EmailBasedDialogComponent,
    LoadingSpinnerComponent,
  ],
  imports: [
    MatButtonModule,
    MatCommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => {
      const auth = getAuth();
      setPersistence(auth, browserLocalPersistence);
      return auth;
    }),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule, // this is where the ReactiveFormsModule is imported
    LottieModule.forRoot({ player: playerFactory })
  ],
  providers: [
    AuthencationService,
    DatabaseService,
    ScreenTrackingService,
    UserTrackingService,
    EnsureAdminService,
    EnsureVendorService,
    EnsureAuthenticated,
    HttpClientModule,
    PaymentService,
    DataProvider,
    BlurSiteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

