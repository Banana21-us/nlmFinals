import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { AccountComponent } from '../admin/Account/account.component'; // Reusing Account component from Admin module
import { CalendarComponent } from '../admin/Calendar/calendar/calendar.component';
import { annRoutes } from '../user/announcement/announcement.route';
import { userLeaveRequest } from '../user/leave/leave.route';
import { requestfile } from './requestfile/requestfile.routes';

// 👤 archives Module Routes


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
            { path: 'Announcement', 
              loadChildren: () => import('../user/announcement/announcement.route').then(r => annRoutes),
            },
            { path: 'leave', 
              loadChildren: () => import('../user/leave/leave.route').then(r => userLeaveRequest),
            },
            { path: 'rfile', 
                loadChildren: () => import('./requestfile/requestfile.routes').then(r => requestfile),
            },
            // { path: 'ann', 
            //   loadChildren: () => import('./announcement/announcement.route').then(r => annRoutes),
            // },
            // 
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


@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivesModule { }
