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
  production: true,
};
