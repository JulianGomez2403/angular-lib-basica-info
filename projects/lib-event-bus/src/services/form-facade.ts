import {AbstractControl, FormArray, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {Store} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {Metadata, MetadataArray, MetadataEntity} from "../interfaces/metadata.interface";
import {FormFactory} from "./form-factory";

@Injectable({
  providedIn: 'root',
})
export class FormFacade<T> {
  constructor(private store: Store, private adapter: FormFactory<T>) {}

  initForm(model: Partial<T>, metadata: Metadata<T>, actions: any): FormGroup {
    const form = this.adapter.createFormFromModel(metadata, model);

    this.syncFormWithState(form, metadata,actions);

    return form;
  }

  addElementToArray(form: FormGroup, controlName: string, actions: any, metadata: Metadata<any>, data: any) {
    const arrayForm = form.get(controlName.split('.')) as FormArray;
    const newFormGroup = this.adapter.createFormFromModel(metadata, data);

    arrayForm.push(newFormGroup);
    this.syncFormWithState(newFormGroup, metadata,actions);
    this.store.dispatch(new actions.AddArrayElement(controlName, data))

  }

  removeElementFromArray(form: FormGroup, controlName: string, index: number, actions: any) {
    const arrayForm = form.get(controlName.split('.')) as FormArray;
    arrayForm.removeAt(index);

    this.store.dispatch(new actions.RemoveArrayElement(controlName, index));
  }

  private syncFormWithState(form: FormGroup, metadata: Metadata<any>, actions: any,pathPrefix:string[] = []) {
    Object.keys(form.controls).forEach(controlName => {
      const formControl = form.get(controlName);
      if (formControl instanceof FormGroup) {
        this.syncFormWithState(formControl as FormGroup, (metadata[controlName] as MetadataEntity<any>).metadata, actions,[...pathPrefix,controlName]);
      } else if (formControl instanceof FormArray) {
        this.syncArrayControls(formControl, (metadata[controlName]as MetadataArray<any>).metadata,actions,[...pathPrefix,controlName]);
      } else {
        formControl?.valueChanges.pipe(
          debounceTime(300),
          distinctUntilChanged()
        ).subscribe(value => {
          this.store.dispatch(new actions.UpdateField([...pathPrefix,controlName].join('.'), value));
        });
      }
    });
  }

  private syncArrayControls(formControl: AbstractControl, metadata: Metadata<any>, actions:any,pathPrefix:string[] = []) {
    const arrayForm = formControl as FormArray;
    arrayForm.controls.forEach((group: AbstractControl, index: number) => {
      this.syncFormWithState(group as FormGroup, metadata, actions,[...pathPrefix]);
    });
  }

}
