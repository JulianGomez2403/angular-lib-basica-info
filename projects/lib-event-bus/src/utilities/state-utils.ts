import {StateContext} from '@ngxs/store';
import {Observable, of, tap} from "rxjs";
import {Status} from "../enums/status.enum";
import {StoreFacade} from "../facades/store-facade";

export function removeArrayElement(ctx: StateContext<any>, payload: { arrayName: string, index: number }) {
  let stateCopy: any = {...ctx.getState()}
  let crawlerAttr = stateCopy;
  let {arrayName, index} = payload

  if (arrayName.length == 0) {
    console.error('Se debe pasar un arrayName para funcionar')
    return
  }

  let attributes = arrayName.split('.')
  let lastAttr = attributes.pop()!

  for (let attr of attributes) {
    crawlerAttr = crawlerAttr[attr]
    if (crawlerAttr == undefined) {
      console.error(`El atributo '${attributes[0]}' no se ha encontrado.`);
      return
    }
  }
  const array = crawlerAttr[lastAttr]

  if (!Array.isArray(array)) {
    console.error(`El atributo '${payload.arrayName}' no es un array`);
    return
  }
  if (array.length <= index) {
    console.error(`El indice '${index}' es incorrecto para el tamaño de array ${array.length} en ${arrayName}`);
    return
  }

  let deleteIndex = -1;
  let count = 0
  for (let i = 0; i < array.length; i++) {
    if (array[i]._status !== Status.DELETED && count++ == index) {
      deleteIndex = i;
      break;
    }
  }
  if (deleteIndex == -1) {
    console.error('El indice pasado es incorrecto')
    return
  }
  if (array[deleteIndex]._status === Status.CREATED) {
    crawlerAttr[lastAttr] = array.slice(0, deleteIndex).concat(array.slice(deleteIndex + 1))
  } else {
    array[deleteIndex]._status = Status.DELETED
    crawlerAttr[lastAttr] = [...array]
  }

  return ctx.setState(stateCopy)
}

export function addElementToArray(ctx: StateContext<any>, payload: {
  arrayName: string,
  data: any
}) {
  let stateCopy: any = {...ctx.getState()}
  let crawlerAttr = stateCopy;
  const {arrayName, data} = payload
  let attributes = arrayName.split('.')
  let lastAttr = attributes.pop()!

  for (let attr of attributes) {
    crawlerAttr = crawlerAttr[attr]
    if (crawlerAttr == undefined) {
      console.error(`El atributo '${attributes[0]}' no se ha encontrado.`);
      return
    }
  }

  const array = crawlerAttr[lastAttr]

  if (!Array.isArray(array)) {
    console.error(`El atributo '${arrayName}' no es un array.`);
    return
  }
  let aux_data = removeStatusAndId(data)
  const prevObj = array.find((item: any) => {
    return JSON.stringify(item) !== '{"_status":1}' && JSON.stringify(removeStatusAndId(item)) == JSON.stringify(aux_data)
  })

  if (prevObj != undefined) {
    prevObj._status = prevObj._status == Status.CREATED ? Status.CREATED : Status.DEFAULT
    return ctx.patchState(stateCopy)
  } else {
    data._status = Status.CREATED;
    if (attributes.length == 0) {

      stateCopy[lastAttr] = [...stateCopy[lastAttr], {...data}]
      return ctx.setState(stateCopy)
    } else {
      crawlerAttr[lastAttr] = [...array, {...data}];
      return ctx.setState(stateCopy)
    }
  }
}

function removeStatusAndId(obj: any) {
  const {_status, id, ...data} = obj;
  return data;
}

export function updateAttribute(ctx: StateContext<any>, payload: { fieldName: string, value: any }) {
  const {fieldName, value} = payload;
  const attributes = fieldName.split('.');

  const newState = updateState(ctx.getState(), attributes, value);
  if (newState) {
    ctx.setState(newState);
  } else {
    console.error('No se ha encontrado el atributo seleccionado');
  }
}

function updateState(state: any, attributes: string[], value: any): any {
  let current: any = state;
  const lastAttribute = attributes.pop()
  let index = 0
  for (let attr of attributes) {
    if (current[attr] === undefined) {
      console.error(`No se ha encontrado el atributo ${attr} seleccionado`);
      return null;
    }

    if (!isNaN(+attr)) { //es numero
      let count = 0;
      for (let i = 0; i < current.length; i++) {
        if (current[i]._status !== Status.DELETED && count++ === parseInt(attr)) {
          attr = i.toString();
          break;
        }
      }
    }

    if (Array.isArray(current[attr])) {
      current[attr] = [...current[attr]];
    } else {
      const ClassType = current[attr].constructor;
      current[attr] = new ClassType(current[attr]);
    }
    current = current[attr];
    index++
  }

  if (current._status != Status.CREATED && current._status != Status.DELETED) {
    current._status = Status.UPDATED;
  }
  current[lastAttribute!] = value;
  return {...state};
}

export function changeSelected(ctx: StateContext<any>, payload: {
  arrayName: string,
  fieldName: string,
  newSelected: number
}) {
  const state: any = ctx.getState()
  const {arrayName, fieldName, newSelected} = payload
  if (Array.isArray(state[arrayName]) && state[arrayName].length > newSelected) {
    const arr = state[arrayName]
    let count = 0
    arr.forEach((obj: any) => {
      if (obj._status !== Status.DELETED) {
        obj[fieldName] = (count === newSelected && !obj[fieldName])
        count++
      }
    });
    ctx.patchState({[arrayName]: arr})
  }
}

export interface fnsParams {
  create$: (entity: any, id: number) => Observable<any>,
  delete$?: (id: number) => Observable<any>,
  edit$?: (entity: any) => Observable<any>
}

export function handleArrayEntities(id:number, entities: any[], fns: fnsParams): Observable<any>[] {
  return entities.map(entity => handleEntity(id, entity, fns));
}

export function handleEntity(id:number, entity: any, fns: fnsParams): Observable<any> {
  switch (entity?._status) {
    case Status.CREATED:
      return fns.create$(entity,id);
    case Status.DELETED:
      return fns.delete$?.(entity.id) || of({});
    case Status.UPDATED:
      return fns.edit$ ? fns.edit$(entity) : fns.create$(entity,id);
    default:
      return of({});
  }
}

export function handleUpdatedStatus(entity: any, edit$: (entity: any) => Observable<any>): Observable<any> {
  return entity?._status === Status.UPDATED ? edit$(entity) : of({});
}

export function handleIdUpdate(facade: StoreFacade, attributeName: string, entity: any, element$: Observable<any>): Observable<any> {
  return element$.pipe(
    tap(response => {
      if (entity && !entity.id && response && response.id) {
        facade.updateFormField(`${attributeName}.id`, response.id);
      }
    })
  );
}

export function handleArrayIdUpdate(facade: StoreFacade, attributeName: string, entities: any[], elements$: Observable<any>[]): Observable<any>[] {
  return elements$.map((element$, index) => handleIdUpdate(facade, `${attributeName}.${index}`, entities[index], element$));
}

export function filterArraysEntities(state: any){
  let newState = {...state}
  Object.keys(newState).forEach(key => {
    if (Array.isArray(newState[key])) {
      newState[key] = newState[key].filter((item: any) => item._status !== Status.DELETED)
    }
  })
  return newState
}
