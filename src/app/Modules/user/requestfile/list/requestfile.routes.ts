import { Routes } from '@angular/router';
import { ListComponent } from './list.component';

export const requestfile: Routes = [
    {path: 'list', component: ListComponent},
    {path: '', redirectTo: 'list', pathMatch: 'full'}
    ];

    
