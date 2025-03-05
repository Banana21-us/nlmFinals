import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../api.service';

interface CalendarDay {
  id: number;
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: { title: string; time: Date }[];
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
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  constructor(private eventService: ApiService) { }
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

  ngOnInit(): void {
    this.generateCalendar();
    this.loadEvents();
  }

  openDialog() {
    this.isDialogOpen = true;
  }

  openDialogupdate(event: any) {
    this.isDialogOpenupdate = true;
    this.title = event.title;
    
    // Convert Date object to the correct format
    if (event.time instanceof Date) {
      this.time = event.time.toISOString().slice(0, 16);
    } else {
      this.time = event.time; // Assuming it's already in the correct format
    }
  }
  

  closeDialog() {
    this.isDialogOpen = false;
  }
  closeDialogupdate() {
    this.isDialogOpenupdate = false;
  }
  updateEvents() {
    const event = {
      title: this.title,
      time: this.time // Ensure time is in the format 'YYYY-MM-DD HH:mm:ss'
    };

    this.eventService.updateEvents(this.id, event).subscribe(response => {
      console.log(response);
      // Handle response here
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

  loadEvents() {
    this.eventService.getEvents().subscribe(
      (events: any[]) => {
        this.events = events;
        this.mapEventsToDays();
      },
      (error: any) => {
        console.error('Error loading events:', error);
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
          day.events.push({ title: event.title, time: eventDate });
        }
      });
    });
  }
}
