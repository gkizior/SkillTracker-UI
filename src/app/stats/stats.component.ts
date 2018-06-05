import { Component } from '@angular/core';
import { AppService } from '../app.service';

import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html'
})
export class StatsComponent {
  private apiUrl = 'http://localhost:8080';

  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'text'
    })
  };

  data: [
    {
      name: '';
      series: [
        {
          name: '';
          value: 0;
        }
      ];
    }
  ];

  searchData: Object;

  number: any;
  skills: String;

  defaultMessage: boolean;

  constructor(
    private appService: AppService,
    private http: Http,
    private httpclient: HttpClient
  ) {
    this.appService.pageTitle = 'Stats';
    this.data = [
      {
        name: '',
        series: [
          {
            name: '',
            value: 0
          }
        ]
      }
    ];
    this.searchData = [
      {
        name: '',
        value: ''
      }
    ];
    this.getAll();
    this.getSearchData();
  }

  getAll() {
    return this.http
      .get(this.apiUrl + '/getStats')
      .pipe(map((res: Response) => res.json()))
      .subscribe(data => {
        this.data = data;
      });
  }

  getSearchData() {
    const body = new Object();
    if (this.number != null && this.skills != null) {
      body['number'] = this.number;
      body['skills'] = this.skills.split(' ');
      this.defaultMessage = false;
    } else {
      body['number'] = 0;
      body['skills'] = ['blank'];
      this.defaultMessage = true;
    }
    return this.httpclient
      .post(this.apiUrl + '/getMatches', body, this.options)
      .subscribe(data => {
        this.searchData = data;
      });
  }
}
