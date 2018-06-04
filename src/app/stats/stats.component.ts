import { Component } from '@angular/core';
import { AppService } from '../app.service';

import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html'
})
export class StatsComponent {
  private apiUrl = 'http://localhost:8080';

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

  constructor(private appService: AppService, private http: Http) {
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
    this.getAll();
  }

  getAll() {
    return this.http
      .get(this.apiUrl + '/getStats')
      .pipe(map((res: Response) => res.json()))
      .subscribe(data => {
        this.data = data;
      });
  }
}
