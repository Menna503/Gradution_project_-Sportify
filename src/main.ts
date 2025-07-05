// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';
// import { provideAnimations } from '@angular/platform-browser/animations';



// bootstrapApplication(AppComponent, appConfig , {
//   providers: [
//     provideAnimations(), // ✅ تأكد من إضافته هنا
//   ],
// })
//   .catch((err) => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
// ✅ دمج provideAnimations مع appConfig
bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), 
    provideAnimations(), 
     provideToastr({
      // positionClass: 'toast-center-center', 
      positionClass:'toast-top-center',
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
       enableHtml: true
    }),
  ],
})
  .catch((err) => console.error(err));

