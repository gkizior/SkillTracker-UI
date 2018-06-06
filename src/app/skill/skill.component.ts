import { Component, OnInit } from '@angular/core';

import { AppService } from '../app.service';

import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html'
})
export class SkillComponent implements OnInit {
  private apiUrl = 'http://localhost:8080';

  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'text'
    })
  };

  skill: any;

  existingSkills: any;

  chartData: any;

  constructor(
    private appService: AppService,
    private http: Http,
    private httpclient: HttpClient
  ) {
    this.chartData = [
      {
        name: '',
        value: ''
      }
    ];
  }

  ngOnInit() {
    this.uniqueSkills();
    this.getSkillGraph();
  }

  newSkill() {
    const skillObject = new Object();
    skillObject['skill'] = this.skill;
    return this.httpclient
      .post(this.apiUrl + '/api/skills', skillObject, this.options)
      .subscribe(result => {
        this.getSkillGraph();
      });
  }

  uniqueSkills() {
    return this.httpclient
      .get(this.apiUrl + '/api/skills/unique', this.options)
      .subscribe(data => {
        this.existingSkills = data;
      });
  }

  getSkillGraph() {
    return this.httpclient
      .get(this.apiUrl + '/getSkillGraph', this.options)
      .subscribe(data => {
        this.chartData = data;
      });
  }

  removeAll(skill) {
    console.log(skill);
    return this.httpclient
      .delete(this.apiUrl + '/api/skills/removeAll/' + skill, this.options)
      .subscribe();
  }
}
