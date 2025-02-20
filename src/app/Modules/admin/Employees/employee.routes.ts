import { Routes } from '@angular/router';
import { UpdateComponent } from './update/update.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';

export const EmployeeRoutes: Routes = [
    {path: 'create', component: CreateComponent},
    {path: 'update', component: UpdateComponent},
    {path: 'list', component: ListComponent},

    {path: '', redirectTo: 'list', pathMatch: 'full'}
    ];

    
