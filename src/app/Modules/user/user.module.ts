import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { AccountComponent } from '../admin/Account/account.component'; // Reusing Account component from Admin module

import { annRoutes } from './announcement/announcement.route';
import { userLeaveRequest } from './leave/leave.route';
import { CalendarComponent } from '../admin/Calendar/calendar/calendar.component';
import { requestfile } from './requestfile/list/requestfile.routes';

// 👤 User Module Routes


const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      { path: 'dashboard',component: DashboardComponent 
            },
            { path: 'account',component: AccountComponent 
            },
            { path: 'calendar',component: CalendarComponent 
            },
            { path: 'rfile', 
              loadChildren: () => import('./requestfile/list/requestfile.routes').then(r => requestfile),
            },
            { path: 'leave', 
              loadChildren: () => import('./leave/leave.route').then(r => userLeaveRequest),
            },
            { path: 'ann', 
              loadChildren: () => import('./announcement/announcement.route').then(r => annRoutes),
            },
            // { path: 'Announcement', 
            //   loadChildren: () => import('./Departments/dapartmets.routes').then(r => departmentsRoutes),
            // },
            // { path: 'LeaveManagement', 
            //   loadChildren: () => import('./LeaveManagement/leavemanagement.routes').then(r => LeaveManagementRoutes),
            // },
            // { path: 'LeaveRequest', 
            //   loadChildren: () => import('./LeaveRequest/leaverequest.routes').then(r => LeaveRequest),
            // },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

// const routes: Routes = [
//   {
//     path: '',
//     component: MainPageComponent,
//     children: [
//       { path: 'dashboard', component: DashboardComponent },
//       { path: 'account', component: AccountComponent },
//       { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
//     ]
//   }
// ];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserModule { }
