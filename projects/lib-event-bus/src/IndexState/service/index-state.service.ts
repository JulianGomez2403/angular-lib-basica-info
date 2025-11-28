import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { IndexState } from '../states/index-state.state';
import { IndexStateActions } from '../actions/index-state.actions';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IndexStateService {

  constructor(private store: Store) {}

  load<T = any>(key: string, initialState?: Partial<T>): Observable<T> {
    return this.store.select(IndexState.indexState).pipe(
      map(({ key: currentKey, data }) => {
        if (currentKey === key && data) return data as T;  
        const defaultState: T = {
          url: key,
          filters: {},
          currentPage: 1,
          pageSize: 50,
          orderParams: { sortedColumn: null, sortDirection: null },
          ...initialState, 
        } as T;
        this.update(key, defaultState);
        return defaultState;
      })
    );
  }

  update<T = any>(key: string, data: T): void {
    this.store.dispatch(new IndexStateActions.Update(key, data));
  }

  getSnapshot<T = any>(): T | null {
    const snapshot = this.store.selectSnapshot(IndexState.data) as T | null;
    return snapshot;
  }
}
