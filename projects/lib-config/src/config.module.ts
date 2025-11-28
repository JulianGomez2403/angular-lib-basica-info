import {APP_INITIALIZER, NgModule} from '@angular/core';
import {ConfigService} from "./service/config.service";
import {provideHttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

export function loadConfig(configService: ConfigService) {
  return () => firstValueFrom(configService.loadConfig('./assets/properties.json', 'default'));
}

@NgModule({
  providers: [
    provideHttpClient(),
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [ConfigService],
      multi: true
    }
  ]
})
export class ConfigModule {}
