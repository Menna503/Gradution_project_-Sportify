import { Component, ErrorHandler } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalErrorHandler } from './services/error_handler/error-service.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],

  imports: [RouterOutlet, CommonModule],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'sports';

  constructor(private router: Router) {}
  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }
}
