import { AbstractControl } from '@angular/forms';

// Validator function to check if date is not in the past
export function dateValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const date = control.value;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set hours to 00:00:00 for comparison

  if (date && new Date(date) < today) {
    return { invalidDate: true };
  }
  return null;
}
