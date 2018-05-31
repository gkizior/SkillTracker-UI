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
  dateOfBirth: Date;
  dateOfJoin: Date;
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
    this.employee.zipCode != null
      ? (this.showAddress = true)
      : (this.showAddress = false);
  }

  convertSkillsArray() {
    let newSkills;
    newSkills = [];
    for (let i = 0; i < this.skills.length; i++) {
      newSkills[i] = this.skills[i].value;
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
      }
    });
  }

  getEmployee() {
    return this.http
      .get(this.apiUrl + '/getEmployee/' + this.Id)
      .pipe(map((res: Response) => res.json()))
      .subscribe(employee => {
        this.employee = employee;
        this.showAddressChange();
      });
  }

  search() {
    const searchCriteria = (<HTMLInputElement>document.getElementById(
      'searchBy'
    )).value;
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

  makeEmployeeJSON() {
    const dummy =
      '{' +
      '"id": "' +
      '0' +
      '", "empId": "' +
      '0' +
      '", "firstName": "' +
      this.firstName +
      '", "lastName": "' +
      this.lastName +
      '", "address": "' +
      this.address +
      '", "city": "' +
      this.city +
      '", "state": "' +
      this.state +
      '", "zipcode": "' +
      this.zipCode +
      '", "dateOfBirth": "' +
      this.dateOfBirth +
      '", "dateOfJoin": "' +
      this.dateOfJoin +
      '", "careerLevel": "' +
      this.careerLevel +
      '", "skills": ' +
      JSON.stringify(this.convertSkillsArray()) +
      '}';
    return JSON.parse(dummy);
  }

  makeSkillJSON() {
    const dummy =
      '{' + '"skills": ' + JSON.stringify(this.convertSkillsArray()) + '}';
    return JSON.parse(dummy);
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
