import { AbstractControl, ValidatorFn } from '@angular/forms';

// Validator function to check if end time is greater than start time
export function endTimeValidator(
  startTimeControlName: string,
  endTimeControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const startTimeControl = formGroup.get(startTimeControlName);
    const endTimeControl = formGroup.get(endTimeControlName);

    if (!startTimeControl || !endTimeControl) {
      return null;
    }

    const startTime = startTimeControl.value;
    const endTime = endTimeControl.value;

    // Check if end time is greater than start time
    if (startTime && endTime && endTime <= startTime) {
      return { endTimeInvalid: true };
    }

    return null;
  };
}
