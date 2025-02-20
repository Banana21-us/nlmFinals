import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { DeptComponent } from './dept/dept.component';
import { DesignationComponent } from './designation/designation.component';
import { PositionComponent } from './position/position.component';

export const departmentsRoutes: Routes = [
    {path: 'main', component: MainComponent,
        children: [
            {path: 'dept', component: DeptComponent},
            {path: 'designation', component: DesignationComponent},
            {path: 'position', component: PositionComponent},
            {path: '', redirectTo: 'dept', pathMatch:"full"}
        ],
    },

    {path: '', redirectTo: 'main', pathMatch: 'full'}
    ];

    
