import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { IndexStateActions } from '../actions/index-state.actions';

export interface IndexStateModel {
  key: string | null;
  data: any | null;
}

@State<IndexStateModel>({
  name: 'indexState',
  defaults: {
    key: null,
    data: null
  }
})
@Injectable()
export class IndexState {

  @Selector()
  static key(state: IndexStateModel): string | null {
    return state.key;
  }

  @Selector()
  static data(state: IndexStateModel): any  {
    return state.data;
  }

  @Selector()
  static indexState(state: IndexStateModel): IndexStateModel {
    return state ?? { key: null, data: null };
  }

  @Action(IndexStateActions.Update)
    update(ctx: StateContext<IndexStateModel>, action: IndexStateActions.Update) {
    const current = ctx.getState();
    if (current.key !== action.key) {
        ctx.setState({ key: action.key, data: action.data });
    } else {
        ctx.patchState({ data: action.data });
    }
    }

    @Action(IndexStateActions.Clear)
    clear(ctx: StateContext<IndexStateModel>) {
    ctx.setState({ key: null, data: null });
    }

}
