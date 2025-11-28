import {Store} from "@ngxs/store";

export class StoreFacade {
  constructor(private store:Store, private actions: any) {
  }

  updateFormField(fieldName: string, value?: any){
    return this.store.dispatch(new this.actions.UpdateAttribute(fieldName, value));
  }

  updateFormFieldByDispatch(fieldName: string, value?: any){
    return this.store.dispatch(new this.actions.UpdateAttribute(fieldName, value));
  }

  updateFormFieldByEvent(fieldName: string, value: any){
    return this.updateFormField(fieldName, value.target.value)
  }

  updateSelected(arrayName:string,fieldName:string,newSelected:number){
    return this.store.dispatch(new this.actions.ChangeSelected(arrayName, fieldName, newSelected))
  }

  removeArrayElement(arrayName: string, index: number){
    return this.store.dispatch(new this.actions.RemoveArrayElement(`${arrayName}`, index))
  }

  addArrayElement(arrayName: string, element: any = {}){
    return this.store.dispatch(new this.actions.AddElementToArray(`${arrayName}`, element))
  }

  get(id:number){
    return this.store.dispatch(new this.actions.Get(id))
  }

  put(){
    return this.store.dispatch(new this.actions.Put)
  }

  post(){
    return this.store.dispatch(new this.actions.Post)
  }

  delete(){
    return this.store.dispatch(new this.actions.Delete)
  }

  reset(){
    return this.store.dispatch(new this.actions.Reset)
  }

}
