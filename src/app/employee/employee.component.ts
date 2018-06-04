import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Employee } from './employee';

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

  employee: Employee;

  showAddress = false;

  firstName: string;
  lastName: string;
  careerLevel: string;
  dateOfBirth: string;
  dateOfJoin: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  skills = [];

  resultId: any;

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
    this.clear();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.enteredId = params['id'] !== undefined ? true : false;
      this.Id = params['id'];
      if (this.enteredId) {
        this.getEmployee();
      } else {
        this.clear();
      }
    });
  }

  getEmployee() {
    return this.http
      .get(this.apiUrl + '/getEmployee/' + this.Id)
      .pipe(map((res: Response) => res.json()))
      .subscribe(employee => {
        this.refreshUI(employee, false);
      });
  }

  refreshUI(employee, update) {
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
    this.zipcode = employee.zipcode;
    if (!update) {
      this.skills = employee.skills;
    }
    this.showAddressChange();
  }

  showAddressChange() {
    this.employee.address != null &&
    this.employee.state != null &&
    this.employee.city != null &&
    (this.employee.zipcode != null || this.employee.zipcode != null)
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
      const employeeJson = this.makeEmployeeJSON();
      const skillsJson = this.makeSkillJSON();
      this.httpclient
        .post(this.apiUrl + '/api/employees/', employeeJson, this.options)
        .subscribe(result => {
          this.resultId = result['id'];
          this.httpclient
            .post(
              this.apiUrl + '/api/skills/' + this.resultId,
              skillsJson,
              this.options
            )
            .subscribe(finalResult => {
              this.router.navigate(['/employee', { id: this.resultId }]);
            });
        });
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
      const employeeJson = this.makeEmployeeJSON();
      this.httpclient
        .put(
          this.apiUrl + '/api/employees/' + this.Id,
          employeeJson,
          this.options
        )
        .subscribe(result => {
          this.refreshUI(result, true);
        });
    }
  }

  deleteSkill(id, skill) {
    const skillJson = new Object();
    skillJson['skills'] = ['' + skill];
    this.httpclient
      .put(this.apiUrl + '/api/skills/remove/' + id, skillJson, this.options)
      .subscribe(result => {
        this.skills.splice(this.skills.indexOf(skill), 1);
      });
  }

  deleteEmployee() {
    if (confirm('Are you sure you want to delete ' + this.firstName + '?')) {
      this.httpclient
        .delete(this.apiUrl + '/api/skills/' + this.Id, this.options)
        .subscribe(result => {
          this.httpclient
            .delete(this.apiUrl + '/api/employees/' + this.Id, this.options)
            .subscribe(finalResult => {
              this.router.navigate(['/employee']);
            });
        });
    }
  }

  addSkill() {
    const skill = (<HTMLInputElement>document.getElementById('addSkillInput'))
      .value;
    if (skill === null || skill === undefined) {
      alert('Not updated. Missing required information');
    } else {
      const skillJson = new Object();
      skillJson['skills'] = ['' + skill];
      try {
        this.httpclient
          .post(this.apiUrl + '/api/skills/' + this.Id, skillJson, this.options)
          .subscribe(
            result => {
              if (this.employee.skills === null) {
                this.employee.skills = [];
              }
              this.employee.skills.push(skill);
              this.skills = this.employee.skills;
            },
            error => {
              alert('Error adding skill. Skill already exists');
            }
          );
      } catch (e) {
        console.log(e);
      }
    }
  }

  makeEmployeeJSON() {
    const employeeJson = new Object();
    employeeJson['firstName'] = this.firstName;
    employeeJson['lastName'] = this.lastName;
    employeeJson['address'] = this.address;
    employeeJson['city'] = this.city;
    employeeJson['state'] = this.state;
    employeeJson['zipcode'] = this.zipcode;
    employeeJson['dateOfBirth'] = this.dateOfBirth;
    employeeJson['dateOfJoin'] = this.dateOfJoin;
    employeeJson['careerLevel'] = this.careerLevel;
    employeeJson['skills'] = this.convertSkillsArray();
    return employeeJson;
  }

  makeSkillJSON() {
    const skillsJson = new Object();
    skillsJson['skills'] = this.convertSkillsArray();
    return skillsJson;
  }

  clear() {
    this.employee = null;
    this.firstName = null;
    this.lastName = null;
    this.careerLevel = null;
    this.dateOfBirth = null;
    this.dateOfJoin = null;
    this.address = null;
    this.state = null;
    this.city = null;
    this.zipcode = null;
    this.skills = null;
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
