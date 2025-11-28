import {AbstractControl, FormArray, FormGroup} from "@angular/forms";
import {Status} from "../enums/status.enum";


export function populateForm(form: AbstractControl, data: any, emitEvent: boolean = false): void {
  if (form instanceof FormGroup && data) {
    Object.keys(form.controls).forEach(key => {
      if (form.controls[key] instanceof FormArray) {
        const formArray = form.controls[key] as FormArray;
        const dataArray = Array.isArray(data[key]) ? data[key] : [];

        for (let i = 0; i < Math.min(formArray.length, dataArray.length); i++) {
          if(typeof dataArray[i].toFormGroup === 'function') {
            populateForm(formArray.at(i), dataArray[i], emitEvent);
          }
        }

        while (formArray.length > dataArray.length) {
          formArray.removeAt(formArray.length - 1, {emitEvent: emitEvent});
        }

        for (let i = formArray.length; i < dataArray.length; i++) {
          if(typeof dataArray[i].toFormGroup === 'function') {
            formArray.push(dataArray[i].toFormGroup(), {emitEvent: emitEvent});
          }
        }
      } else if (form.controls[key] instanceof FormGroup) {
        populateForm(form.controls[key], data[key], emitEvent);
      } else {
        form.controls[key].setValue(data[key], {emitEvent: emitEvent});
      }
    });
  }
}

export function markAllControlsAsTouched(control: AbstractControl) {
  if (control instanceof FormGroup || control instanceof FormArray) {
    control.markAsTouched({ onlySelf: true });

    Object.keys(control.controls).forEach(key => {
      markAllControlsAsTouched((control.controls as any)[key]);
    });
  } else {
    control.markAsTouched({ onlySelf: true });
  }
}

export function resetStatus(obj: any) {
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (Array.isArray(value)) {
      obj[key] = value.filter(val=>val?._status!==Status.DELETED).map((item: any) => resetStatus(item));
    } else if (typeof value === 'object' && value !== null) {
       value._status = Status.DEFAULT;
    }
  }
  obj._status = Status.DEFAULT;
  return obj;
}
