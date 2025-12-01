import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { Status } from "../enums/status.enum";
import { FormFactory } from "../services/form-factory";
import { Metadata, MetadataArray, MetadataEntity } from "../interfaces/metadata.interface";


export function populateForm(form: AbstractControl, data: any, factory: FormFactory<any>,
  metadata?: Metadata<any>, emitEvent: boolean = false): void {
  if (form instanceof FormGroup && data) {
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      const value = data[key];
      const meta = metadata?.[key];

      if (control instanceof FormArray) {
        const metadataArray = (meta as MetadataArray<any>).metadata;
        const newValue = !Array.isArray(value) ? [] : value;

        while (control.length > newValue.length) {
          control.removeAt(control.length - 1, { emitEvent });
        }

        for (let i = 0; i < control.length; i++) {
          populateForm(control.at(i), newValue[i], factory, metadataArray, emitEvent);
        }

        for (let i = control.length; i < newValue.length; i++) {
          const newFormGroup = factory.createFormFromModel(metadataArray, newValue[i]);
          control.push(newFormGroup, { emitEvent });
        }
      } else if (control instanceof FormGroup) {
        populateForm(control, value, factory, (meta as MetadataEntity<any>)?.metadata, emitEvent);
      } else {
        control.setValue(value, { emitEvent });
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
      obj[key] = value.filter(val => val?._status !== Status.DELETED).map((item: any) => resetStatus(item));
    } else if (typeof value === 'object' && value !== null) {
      value._status = Status.DEFAULT;
    }
  }
  obj._status = Status.DEFAULT;
  return obj;
}
