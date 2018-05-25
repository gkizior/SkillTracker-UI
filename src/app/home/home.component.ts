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

  data: any;

  constructor(private appService: AppService, private http: Http) {
    this.appService.pageTitle = 'Home';
    this.getAll();
  }

  search() {
    const searchCriteria = (<HTMLInputElement>document.getElementById(
      'skillInput'
    )).value;
    if (searchCriteria === '') {
      return this.getAll();
    }
    return this.http
      .get(this.apiUrl + '/get/' + searchCriteria)
      .pipe(map((res: Response) => res.json()))
      .subscribe(data => {
        this.data = data;
      });
  }

  getAll() {
    return this.http
      .get(this.apiUrl + '/getAll')
      .pipe(map((res: Response) => res.json()))
      .subscribe(data => {
        this.data = data;
      });
  }

  delete() {
    return this.http
      .get(this.apiUrl + '/delete')
      .pipe(map((res: Response) => res.text()))
      .subscribe(data => {
        this.getAll();
      });
  }

  save() {
    return this.http
      .get(this.apiUrl + '/save')
      .pipe(map((res: Response) => res.text()))
      .subscribe(data => {
        this.getAll();
      });
  }
}
