import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// *******************************************************************************
// NgBootstrap

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// *******************************************************************************
// App

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { LayoutModule } from './layout/layout.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TagInputModule } from 'ngx-chips';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ChartsModule as Ng2ChartsModule } from 'ng2-charts/ng2-charts';

// *******************************************************************************
// Pages

import { HomeComponent } from './home/home.component';
import { EmployeeComponent } from './employee/employee.component';

// *******************************************************************************
//

import { HttpModule } from '@angular/http';
import { StatsComponent } from './stats/stats.component';
import { SkillComponent } from './skill/skill.component';

@NgModule({
  declarations: [
    AppComponent,

    // Pages
    HomeComponent,
    EmployeeComponent,
    StatsComponent,
    SkillComponent
  ],

  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    NgbModule.forRoot(),

    // App
    AppRoutingModule,
    LayoutModule,
    NgxChartsModule,
    TagInputModule,
    FormsModule,
    ConfirmationPopoverModule.forRoot(),
    BrowserAnimationsModule,
    MultiselectDropdownModule,
    Ng2ChartsModule
  ],

  providers: [Title, AppService],

  bootstrap: [AppComponent]
})
export class AppModule {}
