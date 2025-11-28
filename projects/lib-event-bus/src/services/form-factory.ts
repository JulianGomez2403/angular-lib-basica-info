import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {Injectable} from "@angular/core";
import {Metadata, MetadataArray, MetadataEntity} from "../interfaces/metadata.interface";

@Injectable({
  providedIn: 'root',
})
export class FormFactory<T> {

  createFormFromModel<T = any>(metadata: Metadata<T>, model?: Partial<T>): FormGroup {
    const formGroup = new FormGroup({}, { validators: metadata.groupValidators ?? [] });
    Object.keys(metadata).forEach(key => {
      if (key === 'groupValidators') return;
      const mkey = key as keyof T;
      const metadataValue = metadata[key];
      let control
      if ((metadataValue as MetadataArray<any>).array) {
        control = this.createArray((metadataValue as MetadataArray<any>).metadata, ((model && model[mkey]) ? model[mkey] : []) as any[]);
      } else if ((metadataValue as MetadataEntity<any>).metadata) {
        control = this.createFormFromModel((metadataValue as MetadataEntity<any>).metadata , (model && model[mkey]) ? model[mkey] : {});
      } else {
        control = this.createControl(metadata[key], (model ? model[mkey] : undefined));
      }
      formGroup.addControl(key, control);
    })
    return formGroup;
  }

  createControl(config: any, value?: any): FormControl {
    return new FormControl(value, this.getValidators(config));
  }

  private getValidators(config: any) {
    return config.validators || [];
  }

  private createArray(metadata: Metadata<any>, values: any[]): FormArray {
    return new FormArray(values.map((value, index) => {
      return (metadata[index] as MetadataEntity<any>).metadata ? this.createFormFromModel(metadata, value) : this.createControl(metadata[index], value);
    }));
  }
}
