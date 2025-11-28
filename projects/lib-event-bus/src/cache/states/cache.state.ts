import {Action, createSelector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import { CacheActions } from "../actions/cache.actions";

export interface CacheStateModel {[key: string]: any}

@State<CacheStateModel>({
  name: 'cache',
  defaults: {}
})
@Injectable()
export class CacheState {

  static key(key:string){
    return createSelector([CacheState], (state: CacheStateModel) => state[key])
  }

  @Action(CacheActions.UpdateKey)
  updateOther(ctx: StateContext<CacheStateModel>, data: {key: string, data: any}) {
    const newState = ctx.getState();
    newState[data.key] = data.data
    ctx.patchState(newState)
  }}


