import {HttpClient} from "@angular/common/http";
import {map, Observable, of} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configs: { [key: string]: any } = {};

  constructor(private http: HttpClient) {}

  loadConfig(configUrl: string, key: string = 'default'): Observable<void> {
    if (this.configs[key]) {
      return of(void 0);
    }
    return this.http.get(configUrl)
      .pipe(
        map(config => {
          this.configs[key] = config;
        })
      );
  }

  getConfig(key: string = 'default'): any {
    return {...this.configs[key]};
  }
}
