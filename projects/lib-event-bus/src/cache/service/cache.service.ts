import {HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {map, Observable, of, switchMap, tap} from 'rxjs'
import {CacheState} from '../states/cache.state';
import {CacheActions} from '../actions/cache.actions';

const headers = new HttpHeaders({
  'Content-Type': 'application/json'
})


@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor(private store: Store) {}

  includeRequestInCache<T>(key: string, request: Observable<T>): Observable<T> {
    const cache = this.store.selectSnapshot(CacheState.key(key))
    return of('').pipe(
      switchMap(() => {
        if (cache) {
          return of(cache)
        } else {
          return request.pipe(
            tap(items => this.store.dispatch(new CacheActions.UpdateKey(key, items)))
          )
        }
      })
    )
  }
}
