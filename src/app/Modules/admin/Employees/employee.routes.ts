import { Routes } from '@angular/router';
import { UpdateComponent } from './update/update.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { PrintComponent } from './print/print.component';

export const EmployeeRoutes: Routes = [
    {path: 'create', component: CreateComponent},
    {path: 'update', component: UpdateComponent},
    {path: 'list', component: ListComponent},
    {path: 'print', component: PrintComponent},

    {path: '', redirectTo: 'list', pathMatch: 'full'}
    ];

    
