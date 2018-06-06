import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Employee } from './employee';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

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
  employees: Employee[];

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

  disabled = false;

  data: any;
  saved = false;

  defaultOptions: IMultiSelectOption[] = [];
  searchSettings: any;
  defaultModel: number[];

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private http: Http,
    private router: Router,
    private modalService: NgbModal,
    private httpclient: HttpClient
  ) {
    this.appService.pageTitle = 'Employee';
    this.searchSettings = {
      enableSearch: true,
      pullRight: appService.isRTL
    };
    this.getAll();
    this.clear();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.enteredId = params['id'] !== undefined ? true : false;
      this.Id = params['id'];
      if (this.enteredId) {
        this.employees = [];
        this.getOptions();
        if (!this.saved) {
          this.getEmployee();
        } else {
          this.employee.address = this.address;
          this.employee.firstName = this.firstName;
          this.employee.lastName = this.lastName;
          this.employee.careerLevel = this.careerLevel;
          this.employee.city = this.city;
          this.employee.dateOfBirth = this.dateOfBirth;
          this.employee.dateOfJoin = this.dateOfJoin;
          this.employee.empId = this.Id;
          this.employee.state = this.state;
          this.employee.skills = this.convertSkillsArray();
          this.saved = false;
        }
      } else {
        this.clear();
      }
    });
  }

  getOptions() {
    this.http
      .get(this.apiUrl + '/api/skills/unique')
      .pipe(map((res: Response) => res.json()))
      .subscribe(items => {
        this.defaultOptions = [];
        for (let i = 0; i < items.length; i++) {
          this.defaultOptions[i] = { id: i, name: items[i] };
        }
        this.castToMultiSelect(this.employee.skills);
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
      this.castToMultiSelect(employee.skills);
    }
    this.showAddressChange();
  }

  castToMultiSelect(skills) {
    this.skills = [];
    for (let i = 0; i < skills.length; i++) {
      for (let j = 0; j < this.defaultOptions.length; j++) {
        if (this.defaultOptions[j].name === skills[i]) {
          this.skills[i] = this.defaultOptions[j].id;
        }
      }
    }
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
        newSkills[i] = this.getSkill(this.skills[i]);
      }
    }
    return newSkills;
  }

  getSkill(id) {
    for (let i = 0; i < this.defaultOptions.length; i++) {
      if (id === this.defaultOptions[i].id) {
        return this.defaultOptions[i].name;
      }
    }
    return '';
  }

  compSearch() {
    const searchCriteria = (<HTMLInputElement>document.getElementById(
      'searchBy'
    )).value;
    if (searchCriteria === '') {
      return this.getAll();
    }
    return this.http
      .get(this.apiUrl + '/findEmployee/' + searchCriteria)
      .pipe(map((res: Response) => res.json()))
      .subscribe(employee => {
        if (employee !== null) {
          this.data = employee;
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
              this.saved = true;
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
          result['skills'] = this.convertSkillsArray();
          this.refreshUI(result, true);
        });
      const skillsJson = this.makeSkillJSON();
      this.httpclient
        .delete(this.apiUrl + '/api/skills/' + this.Id, this.options)
        .subscribe(result => {
          this.httpclient
            .post(
              this.apiUrl + '/api/skills/' + this.Id,
              skillsJson,
              this.options
            )
            .subscribe(finalResult => {
              this.employee.skills = this.convertSkillsArray();
            });
        });
    }
  }

  deleteEmployee() {
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
    this.employee = new Employee();
    this.firstName = null;
    this.lastName = null;
    this.careerLevel = null;
    this.dateOfBirth = null;
    this.dateOfJoin = null;
    this.address = null;
    this.state = null;
    this.city = null;
    this.zipcode = null;
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
}
