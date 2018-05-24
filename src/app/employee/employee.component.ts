import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit {
  private apiUrl = 'http://localhost:8080';

  enteredId: boolean;
  Id: any;

  employee: any[];

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private http: Http,
    private router: Router
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

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.enteredId = params['id'] !== undefined ? true : false;
      this.Id = params['id'];
      if (this.enteredId) {
        this.getEmployee();
      }
    });
  }

  getEmployee() {
    return this.http
      .get(this.apiUrl + '/getEmployee/' + this.Id)
      .pipe(map((res: Response) => res.json()))
      .subscribe(employee => {
        this.employee = employee;
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
          console.log(employee);
          this.employee = employee;
        }
      });
  }
}
