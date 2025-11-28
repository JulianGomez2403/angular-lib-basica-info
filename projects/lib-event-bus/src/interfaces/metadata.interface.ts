import {ValidatorFn} from "@angular/forms";

export type Metadata<T> = {
  [key in keyof T | string]: MetadataInfo | MetadataArray<any> | MetadataEntity<any>;
}& {
  groupValidators?: ValidatorFn[];
};

export interface MetadataInfo {
  validators?: ValidatorFn[];
}

export interface MetadataArray<U> {
  array: true;
  metadata: Metadata<U>;
}

export interface MetadataEntity<U> {
  metadata: Metadata<U>;
}
