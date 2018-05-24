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

// *******************************************************************************
// Pages

import { HomeComponent } from './home/home.component';
import { EmployeeComponent } from './employee/employee.component';

// *******************************************************************************
//

import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,

    // Pages
    HomeComponent,
    EmployeeComponent
  ],

  imports: [
    BrowserModule,
    HttpModule,
    NgbModule.forRoot(),

    // App
    AppRoutingModule,
    LayoutModule
  ],

  providers: [Title, AppService],

  bootstrap: [AppComponent]
})
export class AppModule {}
