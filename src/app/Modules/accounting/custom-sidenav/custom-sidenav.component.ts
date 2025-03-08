import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MenuItemComponent } from '../menu-item/menu-item.component';
// import { ConnectService } from '../connect.service';

export type MenuItem = {
  icon: string,
  label: string,
  route: string,
  subItems?: MenuItem[];
  unreadCount?: any;
}

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule, MenuItemComponent],
  templateUrl: './custom-sidenav.component.html',
  styleUrls: ['./custom-sidenav.component.css'] 
})
export class CustomSidenavComponent {
  sideNavCollapsed = signal(false)
  @Input() set collapsed(val: boolean){
    this.sideNavCollapsed.set(val);
  }
  // Properties for role and last name
  role = '';
  lname = '';
  fname = '';
  adminPic: string | null = null;
  uid: any;
  private intervalId: any;
  unreadMessagesCount: any = 0;
  
  constructor() {}

  ngOnInit(): void {
    // this.uid = localStorage.getItem('admin_id')
    this.loadUserData();
    
    // this.intervalId = setInterval(() => {
    //   this.loadUnreadMessagesCount();
    // }, 10000)

    // this.conn.adminPic$.subscribe((newImageUrl) => {
    //   if (newImageUrl) {
    //     this.adminPic = newImageUrl; // Update the component's admin picture
    //   }
    // });
    
    // Optionally, initialize with the image from localStorage
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    // if (user && user.admin_pic) {
    //   this.adminPic = user.admin_pic;
    // }
  }
  

  loadUserData() {
    // const userData = localStorage.getItem('user');
    // if (userData) {
    //   const parsedData = JSON.parse(userData);
    //   this.role = parsedData.role || '';
    //   this.lname = parsedData.lname || '';
    //   this.fname = parsedData.fname || '';
    // }
  }

  loadUnreadMessagesCount() {
      // if (this.uid) {
      //   this.conn.getUnreadMessagesCount(this.uid).subscribe(response => {
      //     console.log(response)
      //     this.unreadMessagesCount = response; // Extract the count from the response
      //     console.log('Unread Messages Count:', this.unreadMessagesCount); // Check value here
      //     this.updateMenuItems(); // Update menu items with the new count
      //   });
      // }
    }
    updateMenuItems() {
      this.menuItems.set([
        {
          icon: 'dashboard',
          label: 'Dashboard',
          route: 'dashboard'
        },
        
        {
          icon: 'person',
          label: 'Request Leave',
          route: 'leave'
        },
        {
          icon: 'description',
          label: 'Reports',
          route: 'rfile'
        },
        {
          icon: 'announcement',
          label: 'Announcement',
          route: 'Announcement'
        },
        {
          icon: 'event',
          label: 'Calendar',
          route: 'calendar'
        },
      ]);

    }
  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard'
    },
    
    {
      icon: 'meeting_room',
      label: 'Request Leave',
      route: 'leave'
    },
    {
      icon: 'description',
      label: 'Reports',
      route: 'rfile'
    },
    {
      icon: 'announcement',
      label: 'Announcement',
      route: 'Announcement'
    },
    {
      icon: 'event',
      label: 'Calendar',
      route: 'calendar'
    },
    
  ]);

  trackByFn(index: number, item: MenuItem) {
    return item.route; // or any unique identifier
  }

  profilePicSize = computed( ()=> this.sideNavCollapsed() ? '50' : '100');
}
