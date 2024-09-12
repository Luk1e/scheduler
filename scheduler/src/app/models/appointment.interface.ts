export interface Appointment {
  id: string;
  title: string;
  date: Date;
  description?: string;
  startTime: string;
  endTime: string;
}
