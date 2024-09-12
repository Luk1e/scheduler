import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from '../models/appointment.interface';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointments: { [key: string]: Appointment[] } = {};
  private selectedDate = new BehaviorSubject<Date | null>(null);
  private appointmentsChange = new BehaviorSubject<void>(undefined);
  private activeAppointment = new BehaviorSubject<Appointment | null>(null);

  selectedDate$ = this.selectedDate.asObservable();
  appointmentsChange$ = this.appointmentsChange.asObservable();
  activeAppointment$ = this.activeAppointment.asObservable();

  setSelectedDate(date: Date | null): void {
    this.selectedDate.next(date);
  }

  setActiveAppointment(appointment: Appointment | null): void {
    this.activeAppointment.next(appointment);
  }

  getActiveAppointment(): Observable<Appointment | null> {
    return this.activeAppointment$;
  }

  notifyAppointmentsChange(): void {
    this.appointmentsChange.next();
  }

  getAppointmentsForDate(date: Date | null): Appointment[] {
    if (date) {
      const key = this.getDateKey(date);
      return this.appointments[key] || [];
    }
    return [];
  }

  addAppointment(date: Date | null, appointment: Appointment): void {
    if (date) {
      const key = this.getDateKey(date);
      if (!this.appointments[key]) {
        this.appointments[key] = [];
      }
      this.appointments[key].push(appointment);
      this.notifyAppointmentsChange();
    }
  }

  deleteAppointment(date: Date | null, id: string): void {
    if (date) {
      const key = this.getDateKey(date);
      if (this.appointments[key]) {
        const index = this.appointments[key].findIndex(
          (appointment) => appointment.id === id
        );
        if (index !== -1) {
          this.appointments[key].splice(index, 1);
          this.notifyAppointmentsChange();
        }
      }
    }
  }

  changeAppointmentTimeSlot(
    appointment: Appointment,
    newStartTime: string
  ): void {
    const oldDate = new Date(appointment.date);
    const oldKey = this.getDateKey(oldDate);

    // Remove from old slot
    this.deleteAppointment(oldDate, appointment.id);

    // Update times
    const [hours, minutes] = newStartTime.split(':').map(Number);
    const newDate = new Date(oldDate);
    newDate.setHours(hours, minutes, 0, 0);

    const duration = this.getDurationInMinutes(
      appointment.startTime,
      appointment.endTime
    );
    const newEndDate = new Date(newDate.getTime() + duration * 60000);

    appointment.date = newDate;
    appointment.startTime = this.formatTime(newDate);
    appointment.endTime = this.formatTime(newEndDate);

    // Add to new slot
    const newKey = this.getDateKey(newDate);
    if (!this.appointments[newKey]) {
      this.appointments[newKey] = [];
    }
    this.appointments[newKey].push(appointment);

    this.notifyAppointmentsChange();
  }

  private getDateKey(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  private getDurationInMinutes(startTime: string, endTime: string): number {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / 60000;
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }
}
