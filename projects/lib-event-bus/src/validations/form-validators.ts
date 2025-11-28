import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function nonNegativeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors  | null => {
    const isNegative = control.value < 0;
    return isNegative ? {'negative': {value: control.value}} : null;
  };
}

export function notOnlyWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors  | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? {'whitespace': true} : null;
  };
}

export function mustBeNumber(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors  | null => {
    const isNotNumber = isNaN(control.value);
    return isNotNumber ? {'not_number': true} : null;
  };
}

export function atLeastOne(): ValidatorFn{
  return (control: AbstractControl): ValidationErrors  | null => {
    const values = control.value;
    return values.length === 0 ? {'at_least_one': true} : null;
  };
}
