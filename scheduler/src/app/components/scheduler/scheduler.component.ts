import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.interface';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [CommonModule, MatTableModule, DragDropModule],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.scss',
})
export class SchedulerComponent implements OnInit, OnDestroy {
  appointments: Appointment[] = [];
  selectedDate: Date | null = new Date();
  hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')); // Hours from 00 to 23
  appointmentsByHour: { [key: string]: Appointment[] } = {};
  hourListIds: string[];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef
  ) {
    this.hourListIds = this.hours.map((h) => `${h}-list`);
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.appointmentService.selectedDate$.subscribe((date) => {
        if (date) {
          this.selectedDate = date;
          this.fetchAppointments();
        }
      })
    );

    this.subscriptions.add(
      this.appointmentService.appointmentsChange$.subscribe(() => {
        if (this.selectedDate) {
          this.fetchAppointments();
          this.cdr.markForCheck();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private fetchAppointments(): void {
    this.appointments = this.appointmentService.getAppointmentsForDate(
      this.selectedDate
    );
    this.groupAppointmentsByHour();
  }

  private groupAppointmentsByHour(): void {
    this.appointmentsByHour = {};
    this.hours.forEach((hour) => (this.appointmentsByHour[hour] = []));

    this.appointments.forEach((appointment) => {
      const startHour = appointment.startTime.split(':')[0];
      this.appointmentsByHour[startHour].push(appointment);
    });
  }

  calculateAppointmentStyle(appointment: Appointment, index: number): any {
    const startHour = appointment.startTime.split(':')[0];
    const width = 100 / this.appointmentsByHour[startHour].length;

    return {
      'background-color': this.getRandomColor(appointment.id),
      width: `calc(${width}% - 4px)`,
      left: `calc(${index * width}% + 2px)`,
    };
  }

  getRandomColor(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  }

  onAppointmentClick(appointment: Appointment): void {
    this.appointmentService.setActiveAppointment(appointment);
  }

  onDrop(event: CdkDragDrop<Appointment[]>, targetHour: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const appointment = event.item.data as Appointment;
      this.appointmentService.changeAppointmentTimeSlot(
        appointment,
        `${targetHour}:00`
      );
    }

    this.fetchAppointments();
  }
}
