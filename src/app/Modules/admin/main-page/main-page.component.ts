import { Component, computed, OnInit, signal, ViewChild } from '@angular/core';
import { RouterModule,Router} from '@angular/router';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
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
export class MainPageComponent implements OnInit {
 
  notifications: any = {
    user_requests: [],
    // announcements: [],
    statementofaccouunt: [],
    servicerecords:[],
    leavereq: [],
  };

  notificationCount: number = 0;
  userId: number = 1;
  getWidth: any;
  sidenavWidth:any;
  menunavWidth:any;
  navSize:any;
  private intervalId: any;
  // adminPic: string | null = null;
  // user: any = null;

  collapsed = signal(true)

  adminPic: string | null = null;
  user: any = null;

  // collapsed = signal(true)
  // sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');
  // menunavWidth = computed(() => this.collapsed() ? '65px' : '450px');
  // constructor(private conn: ApiService, private router: Router) {}

  constructor(private conn: ApiService, private router: Router) {}

   onResize() {
    this.getWidth = window.innerWidth
    if (this.getWidth > 414) {
      this.navSize = '250px';
    } else {
      this.navSize = '100%';
    }
  }
  
  ngOnInit(): void {
    const storedUser = localStorage.getItem('users');
    if (storedUser) {
      console.log('Stored user:', storedUser);
      this.user = JSON.parse(storedUser);
    }
    // Subscribe to the adminPic$ observable to get the image URL
    this.conn.adminPic$.subscribe((newImageUrl) => {
      if (newImageUrl) {
        this.adminPic = newImageUrl; // Update the component's admin picture
        localStorage.setItem('admin_pic', JSON.stringify({ img: newImageUrl })); // Store the latest image
      }
    });
  
    const storedAdminPic = localStorage.getItem('admin_pic');
    if (storedAdminPic) {
      try {
        const user = JSON.parse(storedAdminPic);
        if (user && user.img) {
          this.adminPic = user.img;
        }
      } catch (error) {
        console.error('Error parsing admin_pic:', error);
      }
    }

    this.onResize();
    // Set the initial width of the sidenav

    this.sidenavWidth = computed(() => this.collapsed() ? '65px' : this.navSize);
    this.menunavWidth = computed(() => this.collapsed() ? '65px' : '450px');
    console.log(this.getWidth)

    this.loadNotifications();
    this.loadNotificationCount();

    // this.intervalId = setInterval(() => {
    //   this.loadNotifications();
    //   this.loadNotificationCount()
    // }, 10000)
    
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
  loadNotifications(): void {
    const userId = Number(localStorage.getItem('user'));
  
    if (!userId || isNaN(userId)) {
      console.error('Invalid user ID');
      return;
    }
  
    this.conn.getNotifications(userId).subscribe((data: any) => {
      console.log('Raw response:', data);
      this.notifications = [...data.user_requests, ...data.leavereq, ...data.statementofaccouunt, ...data.servicerecords, ]; // Merge both arrays
      console.log('Merged notifications:', this.notifications);
    }, (error) => {
      console.error('Error fetching notifications:', error);
    });
  }
  
  markNotificationAsRead(id: number) {
    this.conn.markAsRead(id).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
  }

  loadNotificationCount() {
    this.conn.getNotificationCount(4).subscribe(data => {
      this.notificationCount = data.count;
      console.log('notif count',this.notificationCount);
      
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
            localStorage.removeItem('admin_pic');
            this.router.navigate(['/login']); // Navigate to the login page
        },
        (error) => {
            console.error('Logout error:', error);
        }
    );
  }
}