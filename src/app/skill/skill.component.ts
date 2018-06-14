import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ViewEncapsulation
} from '@angular/core';

import { AppService } from '../app.service';

import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../vendor/libs/ngx-toastr/ngx-toastr.scss']
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

  emps: any = [];

  empOptions: IMultiSelectOption[] = [];
  searchSettings: any;

  skills: any;

  enteredSkill: boolean;
  routeSkill: any;

  datas: any;

  title = '';
  message = '';
  type = 'success';
  tapToDismiss = true;
  closeButton = false;
  progressBar2 = false;
  preventDuplicates = false;
  newestOnTop = false;
  progressAnimation = 'decreasing';
  positionClass = 'toast-top-right';

  constructor(
    private appService: AppService,
    private http: Http,
    private httpclient: HttpClient,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    public toastrService: ToastrService
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

    this.skills = [
      {
        skill: '',
        number: ''
      }
    ];
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.enteredSkill = params['skill'] !== undefined ? true : false;
      this.routeSkill = params['skill'];
      this.emps = [];
      if (this.enteredSkill) {
        this.getSkillDatas(this.routeSkill);
      } else {
        this.uniqueSkills();
        this.getSkillGraph();
        this.getAll();
      }
    });
  }

  newSkill() {
    if (this.skill === undefined || this.skill === null || this.skill === '') {
      this.showToast('error', 'Need to input a skill');
      return;
    }
    if (this.emps !== undefined && this.emps !== []) {
      const empIdsObject = new Object();
      empIdsObject['empIds'] = this.emps;
      empIdsObject['skill'] = this.skill;
      return this.httpclient
        .post(this.apiUrl + '/api/skills/create', empIdsObject, this.options)
        .subscribe(result => {
          this.getSkillGraph();
          this.showToast('success', 'Created ' + this.skill);
        });
    } else {
      const skillObject = new Object();
      skillObject['skill'] = this.skill;
      return this.httpclient
        .post(this.apiUrl + '/api/skills', skillObject, this.options)
        .subscribe(result => {
          this.getSkillGraph();
          this.showToast(
            'success',
            'Created ' + this.skill + ' with employees'
          );
        });
    }
  }

  updateSkill() {
    const empIdsObject = new Object();
    empIdsObject['empIds'] = this.emps;
    empIdsObject['skill'] = this.routeSkill;
    return this.httpclient
      .put(this.apiUrl + '/api/skills/update', empIdsObject, this.options)
      .subscribe(result => {
        this.emps = [];
        this.showToast('success', 'Updated ' + this.routeSkill);
        this.router.navigate(['/skill']);
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

  getSkillDatas(skill) {
    const name = new Object();
    name['name'] = skill;
    return this.httpclient
      .post(this.apiUrl + '/getSkillDatas', name, this.options)
      .subscribe(data => {
        this.datas = data;
        this.getAll();
      });
  }

  getAll() {
    return this.http
      .get(this.apiUrl + '/getAll')
      .pipe(map((res: Response) => res.json()))
      .subscribe(data => {
        this.empOptions = [];
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].skills.length; j++) {
            if (data[i].skills[j] === this.routeSkill) {
              this.emps[this.emps.length] = data[i].empId;
            }
          }
          this.empOptions[i] = {
            id: data[i].empId,
            name: data[i].firstName + ' ' + data[i].lastName
          };
        }
      });
  }

  removeAll() {
    const skill = new Object();
    skill['name'] = this.routeSkill;
    return this.httpclient
      .put(this.apiUrl + '/api/skills/removeAll', skill, this.options)
      .subscribe(data => {
        this.showToast('success', 'Removed ' + this.routeSkill);
        this.router.navigate(['/skill']);
      });
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

  showToast(type, message) {
    this.type = type;
    const options = {
      tapToDismiss: this.tapToDismiss,
      closeButton: this.closeButton,
      progressBar: this.progressBar2,
      progressAnimation: this.progressAnimation,
      positionClass: this.positionClass,
      rtl: this.appService.isRTL
    };

    // `newestOnTop` and `preventDuplicates` options must be set on global config
    this.toastrService.toastrConfig.newestOnTop = this.newestOnTop;
    this.toastrService.toastrConfig.preventDuplicates = this.preventDuplicates;

    this.toastrService[this.type](this.message || message, this.title, options);
  }
}
