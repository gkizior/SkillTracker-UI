import { Component, OnInit } from '@angular/core';

import { AppService } from '../app.service';

import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

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

  emps: any;

  empOptions: IMultiSelectOption[] = [];
  searchSettings: any;

  constructor(
    private appService: AppService,
    private http: Http,
    private httpclient: HttpClient,
    private modalService: NgbModal
  ) {
    this.appService.pageTitle = 'Skill';
    this.searchSettings = {
      enableSearch: true,
      pullRight: appService.isRTL
    };
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
    this.getAll();
  }

  newSkill() {
    if (this.skill === undefined || this.skill === null || this.skill === '') {
      alert('Need to input a skill');
      return;
    }
    if (this.emps !== undefined && this.emps !== []) {
      const empIdsObject = new Object();
      empIdsObject['empIds'] = this.emps;
      return this.httpclient
        .post(
          this.apiUrl + '/api/skills/create/' + this.skill,
          empIdsObject,
          this.options
        )
        .subscribe(result => {
          this.getSkillGraph();
        });
    } else {
      const skillObject = new Object();
      skillObject['skill'] = this.skill;
      return this.httpclient
        .post(this.apiUrl + '/api/skills', skillObject, this.options)
        .subscribe(result => {
          this.getSkillGraph();
        });
    }
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

  getAll() {
    return this.http
      .get(this.apiUrl + '/getAll')
      .pipe(map((res: Response) => res.json()))
      .subscribe(data => {
        this.empOptions = [];
        for (let i = 0; i < data.length; i++) {
          this.empOptions[i] = {
            id: data[i].empId,
            name: data[i].firstName + ' ' + data[i].lastName
          };
        }
      });
  }

  removeAll(skill) {
    console.log(skill);
    return this.httpclient
      .delete(this.apiUrl + '/api/skills/removeAll/' + skill, this.options)
      .subscribe();
  }

  open(content, options = {}) {
    this.modalService.open(content, options).result.then(
      result => {
        console.log(`Closed with: ${result}`);
      },
      reason => {
        console.log(`Dismissed ${this.getDismissReason(reason)}`);
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
