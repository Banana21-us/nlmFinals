import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterModule,Router} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CustomSidenavComponent } from "../custom-sidenav/custom-sidenav.component";
import { MatBadgeModule } from '@angular/material/badge'
import { MatMenuModule } from '@angular/material/menu'
import { ApiService } from '../../../api.service';

@Component({
  selector: 'app-main-page',
  imports: [RouterModule, MatSidenavModule, CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatListModule, CustomSidenavComponent,MatBadgeModule,MatMenuModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  notifications: any[] = [];
  notificationCount: number = 0;
  getWidth: any;
  sidenavWidth:any;
  menunavWidth:any;
  navSize:any;
  adminPic: string | null = null;
  user: any = null;

  collapsed = signal(true)

  constructor(private conn: ApiService, private router: Router) {}

   onResize() {
    this.getWidth = window.innerWidth
    if (this.getWidth > 414) {
      this.navSize = '250px';
    } else {
      this.navSize = '100%';
    }
  }

  ngOnInit() {
    const storedUser = localStorage.getItem('users');
    if (storedUser) {
      console.log('Stored user:', storedUser);
      this.user = JSON.parse(storedUser);
    }
    // Get the current window width
    this.onResize();
    // Set the initial width of the sidenav

    this.sidenavWidth = computed(() => this.collapsed() ? '65px' : this.navSize);
    this.menunavWidth = computed(() => this.collapsed() ? '65px' : '450px');
    console.log(this.getWidth)
    // Subscribe to the adminPic$ observable to get the image URL
    // this.conn.adminPic$.subscribe((newImageUrl) => {
    //   if (newImageUrl) {
    //     this.adminPic = newImageUrl; // Update the component's admin picture
    //   }
    // });

    // // Optionally, initialize with the image from localStorage
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    // if (user && user.admin_pic) {
    //   this.adminPic = user.admin_pic;
    // }
  }
  getRelativeTime(dateString: string): string {
    const now = new Date();
    const createdAt = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else if (diffInSeconds < 30 * 86400) {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    } else {
      return createdAt.toLocaleDateString(); // Fallback to normal date
    }
  }
  loadNotifications() {
    this.conn.getNotifications().subscribe((data: any) => {
      this.notifications = data;
      console.log('notif',this.notifications);
    });
  }
  del(id: number) {
    this.conn.markAsdelete(id).subscribe(() => {
      this.loadNotifications(); // Refresh list
      // this.router.navigate(['/admin-page/Employee/list']);
    });
  }
  onLogout() {
    this.conn.logout().subscribe(
        (response) => {
            console.log('Logout successful:', response);
            localStorage.removeItem('token');
            localStorage.removeItem('users');
            localStorage.removeItem('user');
            localStorage.removeItem('position');
            this.router.navigate(['/login']); // Navigate to the login page
        },
        (error) => {
            console.error('Logout error:', error);
        }
    );
  }
}