import { Routes } from '@angular/router';
import { AnnouncementComponent } from './announcement.component';

export const announcementRoutes: Routes = [
    {path: 'announcement', component: AnnouncementComponent},

    {path: '', redirectTo: 'announcement', pathMatch: 'full'}
    ];

    
