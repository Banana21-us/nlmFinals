import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { DeptComponent } from './dept/dept.component';
import { DesignationComponent } from './designation/designation.component';
import { PositionComponent } from './position/position.component';
import { WorkstatusComponent } from './workstatus/workstatus.component';
import { CategoryComponent } from './category/category.component';

export const departmentsRoutes: Routes = [
    {path: 'main', component: MainComponent,
        children: [
            {path: 'dept', component: DeptComponent},
            {path: 'designation', component: DesignationComponent},
            {path: 'position', component: PositionComponent},
            {path: 'workstatus', component: WorkstatusComponent},
            {path: 'category', component: CategoryComponent},
            {path: '', redirectTo: 'dept', pathMatch:"full"}
        ],
    },

    {path: '', redirectTo: 'main', pathMatch: 'full'}
    ];

    
