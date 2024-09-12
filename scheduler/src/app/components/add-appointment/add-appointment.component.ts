import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { dateValidator, endTimeValidator } from '../../validators';

@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
  ],
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.scss'],
})
export class AddAppointmentComponent {
  appointmentForm: FormGroup;
  times: string[] = this.generateTimes();

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    public dialogRef: MatDialogRef<AddAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date | null }
  ) {
    this.appointmentForm = this.fb.group(
      {
        title: ['', Validators.required],
        date: [null, [Validators.required, dateValidator]],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        description: [''],
      },
      {
        validators: endTimeValidator('startTime', 'endTime'),
      }
    );
  }

  private generateTimes(): string[] {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        times.push(time);
      }
    }
    return times;
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const newAppointment = this.appointmentForm.value;
      newAppointment.id =
        new Date().toDateString() + this.appointmentForm.value.title;

      if (this.appointmentForm.value.date) {
        this.appointmentService.addAppointment(
          this.appointmentForm.value.date,
          newAppointment
        );
        this.dialogRef.close();
      } else {
        console.warn('No date provided. Cannot add appointment.');
      }
    } else {
      this.appointmentForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get title() {
    return this.appointmentForm.get('title');
  }

  get date() {
    return this.appointmentForm.get('date');
  }

  get startTime() {
    return this.appointmentForm.get('startTime');
  }

  get endTime() {
    return this.appointmentForm.get('endTime');
  }

  get description() {
    return this.appointmentForm.get('description');
  }
}
