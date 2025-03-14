import { Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { UpdateComponent } from './update/update.component';

export const requestfile: Routes = [
    {path: 'create', component: CreateComponent},
    {path: 'list', component: ListComponent},
    {path: 'update', component: UpdateComponent},

    {path: '', redirectTo: 'list', pathMatch: 'full'}
    ];

    
