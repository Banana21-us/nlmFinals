import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { AccountComponent } from './Account/account.component';
import { announcementRoutes } from './Announcements/announement.routes';
import { departmentsRoutes } from './Departments/dapartmets.routes';
import { EmployeeRoutes } from './Employees/employee.routes';
import { LeaveManagementRoutes } from './LeaveManagement/leavemanagement.routes';
import { LeaveRequest } from './LeaveRequest/leaverequest.routes';

// 🛠 Admin Module Routes
const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      { path: 'dashboard',component: DashboardComponent 
            },
            { path: 'account',component: AccountComponent 
            },
            { path: 'Employee', 
              loadChildren: () => import('./Employees/employee.routes').then(r => EmployeeRoutes),
            },
            { path: 'Announcement', 
              loadChildren: () => import('./Announcements/announement.routes').then(r => announcementRoutes),
            },
            { path: 'Departments', 
              loadChildren: () => import('./Departments/dapartmets.routes').then(r => departmentsRoutes),
            },
            { path: 'LeaveManagement', 
              loadChildren: () => import('./LeaveManagement/leavemanagement.routes').then(r => LeaveManagementRoutes),
            },
            { path: 'LeaveRequest', 
              loadChildren: () => import('./LeaveRequest/leaverequest.routes').then(r => LeaveRequest),
            },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminModule { }
// { path: 'admin-page', component: MainPageComponent ,
//   children: [
//     { path: 'Dashboard',component: DashboardComponent 
//     },
//     { path: 'Account',component: AccountComponent 
//     },
//     { path: 'Employee', 
//       loadChildren: () => import('./Employees/employee.routes').then(r => EmployeeRoutes),
//     },
//     { path: 'Announcement', 
//       loadChildren: () => import('./Announcements/announement.routes').then(r => announcementRoutes),
//     },
//     { path: 'Departments', 
//       loadChildren: () => import('./Departments/dapartmets.routes').then(r => departmentsRoutes),
//     },
//     { path: 'LeaveManagement', 
//       loadChildren: () => import('./LeaveManagement/leavemanagement.routes').then(r => LeaveManagementRoutes),
//     },
//     { path: 'LeaveRequest', 
//       loadChildren: () => import('./LeaveRequest/leaverequest.routes').then(r => LeaveRequest),
//     },
//     { path: '', redirectTo: 'Dashboard', pathMatch: 'full' }
//   ]
// },