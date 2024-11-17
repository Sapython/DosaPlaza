// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'fbms-shreeva-demo',
    appId: '1:403464137223:web:02cc88be092fd4c6a858a2',
    storageBucket: 'fbms-shreeva-demo.appspot.com',
    locationId: 'us-central',
    apiKey: 'REPLACEMENT_STRING',
    authDomain: 'fbms-shreeva-demo.firebaseapp.com',
    messagingSenderId: '403464137223',
    measurementId: 'G-NCRQ7F0T5R',
  },
  cloudFunctions: {
    createOrder: 'https://us-central1-trivenisangam-aef13.cloudfunctions.net/createOrder',
    capturePayment:
      'https://us-central1-trivenisangam-aef13.cloudfunctions.net/capturePayments',
  },
  RAZORPAY_KEY_ID: 'REPLACEMENT_STRING_uaE9gdz5zjzhGm',
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error'; // Included with Angular CLI.
