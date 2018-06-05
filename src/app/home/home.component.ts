import { Component } from '@angular/core';
import { AppService } from '../app.service';

import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private apiUrl = 'http://localhost:8080';

  constructor(private appService: AppService, private http: Http) {
    this.appService.pageTitle = 'Home';
  }
}
