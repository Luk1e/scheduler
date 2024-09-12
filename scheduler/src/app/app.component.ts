import { Component } from '@angular/core';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalendarComponent, SchedulerComponent, AppointmentDetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'scheduler';
}
