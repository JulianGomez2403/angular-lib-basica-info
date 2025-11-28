import {ErrorHandler, NgModule} from '@angular/core';
import { LoggerService } from './services/logger.service';
import {ErrorHandlerService} from "./services/error-handler.service";

@NgModule({
  providers: [
    LoggerService,
    { provide: ErrorHandler, useClass: ErrorHandlerService }
  ]
})
export class LoggerModule { }
