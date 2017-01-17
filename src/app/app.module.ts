import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { HelloModule } from './hello/hello.module';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppRoutingModule,
    CoreModule,
    HelloModule,
  ],
  declarations: [
    AppComponent,
  ],
})
export class AppModule {}
