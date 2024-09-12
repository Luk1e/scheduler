import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.interface';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss'],
})
export class AppointmentDetailsComponent implements OnInit, OnDestroy {
  appointment: Appointment | null = null;
  private subscription: Subscription | null = null;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.subscription = this.appointmentService
      .getActiveAppointment()
      .subscribe((appointment) => {
        this.appointment = appointment || null;
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  calculateDuration(): number {
    if (!this.appointment) return 0;
    const start = new Date(`1970-01-01T${this.appointment.startTime}`);
    const end = new Date(`1970-01-01T${this.appointment.endTime}`);
    return (end.getTime() - start.getTime()) / 60000;
  }

  onDelete(): void {
    if (this.appointment) {
      this.appointmentService.deleteAppointment(
        this.appointment.date,
        this.appointment.id
      );
      this.appointmentService.setActiveAppointment(null);
    }
  }
}
