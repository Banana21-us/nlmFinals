import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
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
  @Output() menuItemClicked = new EventEmitter<void>();
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

  onMenuItemClick() {
    console.log('Menu item clicked');
    this.menuItemClicked.emit(); // Emit event when an item is clicked
  }
  ngOnInit(): void {

  }
  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard'
    },
    {
      icon: 'description',
      label: 'Employee Files',
      route: 'emplist'
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
  ]);

  trackByFn(index: number, item: MenuItem) {
    return item.route; // or any unique identifier
  }

  profilePicSize = computed( ()=> this.sideNavCollapsed() ? '50' : '100');
}
