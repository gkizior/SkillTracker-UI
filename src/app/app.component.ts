import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WMP Skill Tracker';

  private apiUrl = 'http://localhost:8080';

  data: any;

  constructor(private http: Http) {
    this.getAll();
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
        console.log(data);
        this.getAll();
      });
  }

  save() {
    return this.http
      .get(this.apiUrl + '/save')
      .pipe(map((res: Response) => res.text()))
      .subscribe(data => {
        console.log(data);
        this.getAll();
      });
  }
}
