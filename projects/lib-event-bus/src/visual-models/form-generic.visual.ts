import {FormGroup} from "@angular/forms";

export interface FormGenericVisual{
  id?: number;
  form: FormGroup;
  isEdit: boolean;
  isNew: boolean;
  isShow: boolean;
}
