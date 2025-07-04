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

// ✅ دمج provideAnimations مع appConfig
bootstrapApplication(AppComponent, {
  ...appConfig, // إبقاء التكوينات الأصلية
  providers: [
    ...(appConfig.providers || []), // الاحتفاظ بالمزودين الأصليين
    provideAnimations(), // إضافة مزود الرسوم المتحركة
  ],
})
  .catch((err) => console.error(err));

