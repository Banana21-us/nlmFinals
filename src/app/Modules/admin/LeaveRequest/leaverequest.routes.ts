import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';

export const LeaveRequest: Routes = [
    {path: 'list', component: ListComponent},

    {path: '', redirectTo: 'list', pathMatch: 'full'}
    ];

    
