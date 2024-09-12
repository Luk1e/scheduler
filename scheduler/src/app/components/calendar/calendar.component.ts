import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker'; // Correct import
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { AddAppointmentComponent } from '../add-appointment/add-appointment.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AddAppointmentComponent,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  selectedDate: Date | null = null;

  constructor(
    private dialog: MatDialog,
    private appointmentService: AppointmentService
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AddAppointmentComponent, {
      width: '400px',
    });
  }

  onDateChange(date: Date | null): void {
    this.selectedDate = date;
    this.appointmentService.setSelectedDate(this.selectedDate);
  }
}
