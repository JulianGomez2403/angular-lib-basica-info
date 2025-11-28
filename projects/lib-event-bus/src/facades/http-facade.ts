import { Injectable } from "@angular/core";
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { ZodSchema } from "zod";
import {LoggerService} from "@info/lib-logger";

type HttpOptions = {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  context?: HttpContext;
  observe?: "body";
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  reportProgress?: boolean;
  responseType?: "json";
  withCredentials?: boolean;
  transferCache?: { includeHeaders?: string[] } | boolean;
};

@Injectable({
  providedIn: "root",
})
export class HttpFacade {
  constructor(private http: HttpClient, private logger: LoggerService) {}

  private validate<T>(schema: ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      this.logger.error("Error validación del esquema: ", result.error.format());
      throw new Error("Error en la validación del esquema");
    }
    return result.data;
  }

  get<T>(schema: ZodSchema<T>, url: string, httpOptions?: HttpOptions): Observable<T> {
    return this.http.get<T>(url, httpOptions).pipe(
      map((data) => this.validate(schema, data))
    );
  }

  put<T>(schema: ZodSchema<T>, url: string, body: any, httpOptions?: HttpOptions): Observable<T> {
    const validatedBody = this.validate(schema, body);
    return this.http.put<T>(url, validatedBody, httpOptions).pipe(
      map((data) => this.validate(schema, data))
    );
  }

  post<T>(schema: ZodSchema<T>, url: string, body: any, httpOptions?: HttpOptions): Observable<T> {
    const validatedBody = this.validate(schema, body);
    return this.http.post<T>(url, validatedBody, httpOptions).pipe(
      map((data) => this.validate(schema, data))
    );
  }

  delete(url: string, httpOptions?: HttpOptions): Observable<any> {
    return this.http.delete(url, httpOptions)
  }
}
