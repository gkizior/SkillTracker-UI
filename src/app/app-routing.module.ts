import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// *******************************************************************************
// Layouts

import { Layout1Component } from './layout/layout-1/layout-1.component';

// *******************************************************************************
// Pages

import { HomeComponent } from './home/home.component';
import { EmployeeComponent } from './employee/employee.component';

// *******************************************************************************
// Routes

const routes: Routes = [
  {
    path: '',
    component: Layout1Component,
    pathMatch: 'full',
    children: [{ path: '', component: HomeComponent }]
  },

  {
    path: 'employee',
    component: Layout1Component,
    children: [
      { path: '', component: EmployeeComponent },
      { path: ':id', component: EmployeeComponent }
    ]
  }
];

// *******************************************************************************
//

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
