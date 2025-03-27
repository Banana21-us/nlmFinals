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
    announcements: [],
    statementofaccount: [],
    servicerecords:[],
    leavereq: [],
    leaveapproval: [],
    events: [],
  };

  notificationCount: number = 0;
  
  sidenavWidth:any;
  menunavWidth:any;
  private intervalId: any;

  collapsed = signal(true)
  getWidth: number = window.innerWidth;
  collapsedState = signal(false);  
  navSize: string = '100%';
  adminPic: string | null = null;
  user: any = null;

  constructor(private conn: ApiService, private router: Router) {}

  onResize() {
    this.getWidth = window.innerWidth;
    if (this.getWidth > 480) {
      this.navSize = '250px';
      this.collapsedState.set(false); 
    } else {
      this.navSize = '100%';
      this.collapsedState.set(true);
       // Collapse on small screens
    }
  }
  closeMenu() {
    if (this.getWidth <= 480) {
      this.collapsedState.set(true); // Close menu on small screens
    }
  }
  
  onMenuItemClick() {
    this.closeMenu(); // Close the menu when a menu item is clicked
  }

  toggleMenu() {
    this.collapsedState.set(!this.collapsedState());
    console.log('Collapsed State:', this.collapsedState());
  }
  
  ngOnInit(): void {
    window.addEventListener('resize', () => this.onResize());
    this.onResize();

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

    this.sidenavWidth = computed(() => this.collapsedState() ? '65px' : this.navSize);
    this.menunavWidth = computed(() => this.collapsedState() ? '65px' : '450px');
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
      this.notifications = [...data.user_requests, ...data.leavereq, ...data.leaveapproval, ...data.statementofaccount, ...data.announcements, ...data.servicerecords,...data.events ];
      console.log('Merged notifications:', this.notifications);
    }, (error) => {
      console.error('Error fetching notifications:', error);
    });
  }
  
  markNotificationAsRead(notification: any) { // Change parameter to accept the notification object
    this.conn.markAsRead(notification.id).subscribe(
      response => {
        console.log(response);
        this.routeToPage(notification); // Call routeToPage with the notification object
        this.loadNotifications();
        this.loadNotificationCount();
      },
      error => console.error(error)
    );
  }

  routeToPage(notification: any) {
    const routes: { [key: string]: string } = {
      'User Request': '/admin-page/Employee/list',
      'Announcements': '/admin-page/Announcement/list',
      'Statement of Account': '/admin-page/rfile/list',
      'Service Records': '/admin-page/rfile/list',
      'Leave Request': '/admin-page/LeaveRequest/list',
      'Leave Approval': '/admin-page/LeaveRequest/list',
      'Event': '/admin-page/calendar'
    };

    const route = routes[notification.type] || '/notifications';
    this.router.navigate([route]);
  }

  loadNotificationCount() {
    const storedUser = localStorage.getItem('users'); // ✅ Get 'users' instead of 'user'
    if (storedUser) {
        this.user = JSON.parse(storedUser); // Parse JSON to object
    }

    if (this.user?.id) { // Ensure user and id exist
        const userId = Number(this.user.id);
        console.log('Fetching notification count for user ID:', userId); // Debugging log

        this.conn.getNotificationCount(userId).subscribe({
            next: (data) => {
                this.notificationCount = data.count;
                console.log('Notification Count:', this.notificationCount);
            },
            error: (error) => {
                console.error('Error fetching notifications:', error);
            }
        });
    } else {
        console.warn('User ID not found in local storage.');
    }
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