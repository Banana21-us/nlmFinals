import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../api.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: { id: number; title: string; time: Date }[];
}



@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ToastModule,ButtonModule,RippleModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [MessageService]
})
export class CalendarComponent implements OnInit {
  constructor(private eventService: ApiService, private messageService: MessageService) { }
  isDialogOpenupdate = false;
  isDialogOpen = false;
  title = '';
  time = '';
  calendarDays: any[] = [];
  selectedCalendarDayId: number | null = null;
  currentDate: Date = new Date();
  daysInMonth: CalendarDay[] = [];
  isCurrentMonth: boolean = false;
  date: Date = new Date();
  events: any[] = []; // Make sure events is initialized as an array
  eventId = 0;

  loadEvents() {
    const userId = Number(localStorage.getItem('user'));
    this.loadEventsbyuser(userId);
  }

  ngOnInit(): void {
    this.generateCalendar();
    this.loadEvents();
  }
  openDialog() {
    this.isDialogOpen = true;
    this.title ="";
  }
  openDialogupdate(event: any) { 
    this.isDialogOpenupdate = true;
    this.title = event.title;
    this.eventId = event.id;
    console.log('Event:', this.eventId, this.title); 

    if (event.time) {
      const eventTime = new Date(event.time); 
      const localTime = new Date(eventTime.getTime() - eventTime.getTimezoneOffset() * 60000);
      this.time = localTime.toISOString().slice(0, 16); // Format for datetime-local input
  }
}


  closeDialog() {
    this.isDialogOpen = false;
  }
  closeDialogupdate() {
    this.isDialogOpenupdate = false;
  }
  updateEvents() {
    console.log('Updating event:', this.title, this.time,this.eventId);
    // Ensure time is in the format 'YYYY-MM-DD HH:mm:ss'
    const event = {
      id: this.eventId,
      title: this.title,
      time: this.time,
      // time:new Date(this.time).toISOString(), // Convert to ISO string
    };

    this.eventService.updateEvents(this.eventId, event).subscribe(response => {
      console.log("values",response);
      // Handle response here
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Updated successfully',
        life: 3000
    });
      this.closeDialogupdate();
      this.loadEvents(); // Reload events after updating
      
    }, error => {
      console.error(error);
      // Handle error here
    });
    
  }
  deleteEvents(){
    console.log('Deleting event:', this.eventId);
    this.eventService.deleteEvents(this.eventId).subscribe(response => {
      console.log("values",response);
      // Handle response here
      this.closeDialogupdate();
      this.loadEvents();
    }, error => {
      console.error(error);
      // Handle error here
    });
  }
  submitEvent() {
    const eventData = {
      title: this.title,
      time: this.time, // Keep time as string for now
      userid: localStorage.getItem('user')// You need to get this from your user session
    };

    this.eventService.createEvent(eventData).subscribe(
      (response: any) => {
        console.log('Event created successfully:', response);
        this.closeDialog();
        this.loadEvents(); // Reload events after creating a new one
      },
      (error: any) => {
        console.error('Error creating event:', error);
      }
    );
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
    this.loadEvents();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
    this.loadEvents();
  }

  goToToday() {
    this.currentDate = new Date();
    this.generateCalendar();
    this.loadEvents();
  }

  generateCalendar() {
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();

    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i + 1);
      return {
        date,
        day: i + 1,
        isCurrentMonth: true,
        isToday: new Date().toDateString() === date.toDateString(),
        isSelected: false,
        events: [] // Initialize as empty array
      };
    });

    const firstDayOfWeek = firstDay.getDay();
    const previousMonthDays = [];

    if (firstDayOfWeek > 0) {
      const previousMonthLastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0);
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, previousMonthLastDay.getDate() - i);
        previousMonthDays.push({
          date,
          day: date.getDate(),
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          events: []
        });
      }
    }

    const nextMonthDays = [];
    const lastDayOfWeek = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), daysInMonth).getDay();
    if (lastDayOfWeek < 6) {
      for (let i = lastDayOfWeek + 1; i <= 6; i++) {
        const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, i - lastDayOfWeek);
        nextMonthDays.push({
          date,
          day: date.getDate(),
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          events: []
        });
      }
    }

    this.daysInMonth = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
    this.mapEventsToDays(); // Call this after calendar is generated
  }

    loadEventsbyuser(userId: number) {
      this.eventService.getEventsByUserId(userId).subscribe(
        (events: any[]) => {
          this.events = events;
          console.log('Events by User ID:', this.events);
          this.mapEventsToDays();
        },
        (error: any) => {
          console.error('Error loading events by user ID:', error);
        }
      );
    }


  mapEventsToDays() {
    this.daysInMonth.forEach(day => {
      day.events = []; // Clear existing events
      this.events.forEach(event => {
        const eventDate = new Date(event.time); // Parse event time
        if (
          day.date.getFullYear() === eventDate.getFullYear() &&
          day.date.getMonth() === eventDate.getMonth() &&
          day.date.getDate() === eventDate.getDate()
        ) {
          day.events.push({ id: event.id, title: event.title, time: eventDate });
        }
      });
    });
  }
}
