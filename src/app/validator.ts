import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nicValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const nic = control.value;
    const oldNicPattern = /^[0-9]{9}[vVxX]$/;
    const newNicPattern = /^[0-9]{12}$/;

    if (nic && (oldNicPattern.test(nic) || newNicPattern.test(nic))) {
      return null; // Valid NIC
    }

    return { invalidNic: true }; // Invalid NIC
  };
}

export function dobValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;
    const date = control.value;

    if (!datePattern.test(date)) {
      return { invalidDateFormat: true };
    }

    const [month, day, year] = date.split('/').map(Number);
    const dob = new Date(year, month - 1, day);
    const today = new Date();

    // Check if the date is in the future
    if (dob > today) {
      return { futureDate: true };
    }

    // Calculate age
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    // Check if age is at least minAge
    if (age < minAge) {
      return { underage: true };
    }

    return null; // Valid date
  };
}
