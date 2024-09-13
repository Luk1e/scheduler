# Scheduler Application

## Folder Structure

- **`src/app/components`**: Contains the main `SchedulerComponent` and other related components:

  - **`CalendarComponent`**: Component which displays calendar.
  - **`AddAppointmentComponent`**: Allows users to add new appointments.
  - **`SchedulerComponent`**: Displays a table of appointments for a selected date.
  - **`AppointmentDetailsComponent`**: Shows detailed information about a selected appointment.

- **`src/app/models`**: Contains TypeScript interfaces and models used throughout the application.

- **`src/app/services`**: Contains service files for managing application data and logic.

- **`src/app/validators`**: Contains custom validators used for form validation.

## How It Works

1. **Viewing the Schedule**:

   - Click on a date in the `CalendarComponent` to refresh the scheduler and display the schedule for that day.

2. **Viewing Appointment Details**:

   - Click on an appointment in the `SchedulerComponent` to view its details in the `AppointmentDetailsComponent`.

3. **Creating Appointments**:

   - Use the `AddAppointmentComponent` to create new appointments. Note that:
     - Appointments cannot be created for dates before today.
     - The starting time of an appointment must not exceed the ending time.

4. **Dragging and Dropping Appointments**:
   - Appointments can be dragged and dropped to change their time slots. The new time slot will be saved in the service.
   - The duration of each appointment is fixed. When changing the time slot, the appointment's start and end times are adjusted based on the fixed duration.

## Features and Libraries

- Utilized all required libraries and features for scheduling, appointment management, and form validation.
- Integrated Angular features such as dependency injection, lazy loading, and Angular Material for styling.

## Running the Project

1. Navigate into the project directory:
   ```bash
   cd scheduler
   ```
2. Install the project dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ng serve
   ```

## Contact

For any questions or further information, please contact me at: [luka.gogiashvili.02@gmail.com](mailto:luka.gogiashvili.02@gmail.com).
