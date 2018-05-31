import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../vendor/libs/ngx-chips/ngx-chips.scss']
})
export class EmployeeComponent implements OnInit {
  private apiUrl = 'http://localhost:8080';

  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'text'
    })
  };

  private modalref: any;

  enteredId: boolean;
  Id: any;

  employee: any;

  showAddress = false;

  firstName: string;
  lastName: string;
  careerLevel: string;
  dateOfBirth: string;
  dateOfJoin: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  skills = [];

  returnResult: any;

  autocompleteItems = ['Java', 'AWS', 'Spring', 'Angular', 'DOT NET', 'C#'];
  disabled = false;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private http: Http,
    private router: Router,
    private modalService: NgbModal,
    private httpclient: HttpClient
  ) {
    this.appService.pageTitle = 'Employee';
    this.employee = [
      {
        empId: '',
        firstName: '',
        lastName: '',
        careerLevel: '',
        skills: []
      }
    ];
  }

  showAddressChange() {
    this.employee.address != null &&
    this.employee.state != null &&
    this.employee.city != null &&
    (this.employee.zipCode != null || this.employee.zipcode != null)
      ? (this.showAddress = true)
      : (this.showAddress = false);
  }

  convertSkillsArray() {
    let newSkills;
    newSkills = [];
    if (this.skills != null) {
      for (let i = 0; i < this.skills.length; i++) {
        newSkills[i] = this.skills[i].value;
      }
    }
    return newSkills;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.enteredId = params['id'] !== undefined ? true : false;
      this.Id = params['id'];
      if (this.enteredId) {
        this.getEmployee();
        this.showAddressChange();
      } else {
        this.employee = [
          {
            empId: '',
            firstName: '',
            lastName: '',
            careerLevel: '',
            skills: []
          }
        ];
        this.firstName = null;
        this.lastName = null;
        this.careerLevel = null;
        this.dateOfBirth = null;
        this.dateOfJoin = null;
        this.address = null;
        this.state = null;
        this.city = null;
        this.zipCode = null;
        this.skills = null;
      }
    });
  }

  refreshUI(employee) {
    this.skills = this.employee.skills;
    this.employee = employee;
    this.firstName = employee.firstName;
    this.lastName = employee.lastName;
    this.careerLevel = employee.careerLevel;
    if (
      employee.dateOfBirth != null &&
      typeof employee.dateOfBirth === 'string'
    ) {
      this.dateOfBirth = employee.dateOfBirth.substring(0, 10);
    }
    if (
      employee.dateOfJoin != null &&
      typeof employee.dateOfBirth === 'string'
    ) {
      this.dateOfJoin = employee.dateOfJoin.substring(0, 10);
    }
    this.address = employee.address;
    this.state = employee.state;
    this.city = employee.city;
    this.zipCode = employee.zipCode;
    if (employee.zipcode !== undefined) {
      this.zipCode = employee.zipcode;
    }
    if (employee.skills != null) {
      this.skills = employee.skills;
    }
    this.showAddressChange();
  }

  getEmployee() {
    return this.http
      .get(this.apiUrl + '/getEmployee/' + this.Id)
      .pipe(map((res: Response) => res.json()))
      .subscribe(employee => {
        this.refreshUI(employee);
      });
  }

  search() {
    let searchCriteria = (<HTMLInputElement>document.getElementById('searchBy'))
      .value;
    if (searchCriteria === '') {
      searchCriteria = '........';
    }
    return this.http
      .get(this.apiUrl + '/findEmployee/' + searchCriteria)
      .pipe(map((res: Response) => res.json()))
      .subscribe(employee => {
        if (employee !== null) {
          this.employee = employee;
          this.showAddressChange();
        }
      });
  }

  save() {
    if (
      this.firstName === '' ||
      this.lastName === '' ||
      this.careerLevel === ''
    ) {
      window.alert('Not saved. Missing required information');
    } else {
      const json = this.makeEmployeeJSON();
      const skillJson = this.makeSkillJSON();
      this.httpclient
        .post(this.apiUrl + '/api/employees/', json, this.options)
        .subscribe(result => {
          this.returnResult = result['id'];
          this.httpclient
            .post(
              this.apiUrl + '/api/skills/' + this.returnResult,
              skillJson,
              this.options
            )
            .subscribe(resultSkills => {
              console.log(resultSkills);
            });
        });
      this.clear();
    }
  }

  updateEmployee() {
    if (
      this.firstName === '' ||
      this.lastName === '' ||
      this.careerLevel === ''
    ) {
      window.alert('Not updated. Missing required information');
    } else {
      const json = this.makeEmployeeJSON();
      this.httpclient
        .put(this.apiUrl + '/api/employees/' + this.Id, json, this.options)
        .subscribe(result => {
          this.refreshUI(result);
        });
    }
  }

  deleteSkill(id, skill) {
    this.httpclient
      .delete(this.apiUrl + '/api/skills/' + id + ',' + skill, this.options)
      .subscribe(result => {
        this.skills.splice(this.skills.indexOf(skill), 1);
      });
  }

  addSkill() {
    const skills = [];
    skills[0] = (<HTMLInputElement>document.getElementById(
      'addSkillInput'
    )).value;
    if (skills == null) {
      window.alert('Not updated. Missing required information');
    } else {
      const dummy = new Object();
      dummy['skills'] = skills;
      this.httpclient
        .post(this.apiUrl + '/api/skills/' + this.Id, dummy, this.options)
        .subscribe(result => {
          this.employee.skills.push(skills[0]);
          this.skills = this.employee.skills;
        });
    }
  }

  makeEmployeeJSON() {
    const dummy2 = new Object();
    dummy2['firstName'] = this.firstName;
    dummy2['lastName'] = this.lastName;
    dummy2['address'] = this.address;
    dummy2['city'] = this.city;
    dummy2['state'] = this.state;
    dummy2['zipcode'] = this.zipCode;
    dummy2['dateOfBirth'] = this.dateOfBirth;
    dummy2['dateOfJoin'] = this.dateOfJoin;
    dummy2['careerLevel'] = this.careerLevel;
    dummy2['skills'] = this.convertSkillsArray();
    return dummy2;
  }

  makeSkillJSON() {
    const dummy = new Object();
    dummy['skills'] = this.convertSkillsArray();
    return dummy;
  }

  clear() {
    this.firstName = '';
    this.lastName = '';
    this.careerLevel = '';
    this.skills = [];
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

  checkboxValidation(result) {
    return new Promise(function(resolve, reject) {
      if (result) {
        resolve();
      } else {
        reject('You need to agree with T&C');
      }
    });
  }
}
