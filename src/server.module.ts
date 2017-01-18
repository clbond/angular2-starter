import { NgModule } from '@angular/core';

import {
  UniversalModule,
  isBrowser,
  isNode,
} from 'angular2-universal/node';

import { AppModule } from './app/app.module';

import { AppComponent } from './app/app.component';

declare const Zone;

@NgModule({
  imports: [
    UniversalModule,
    AppModule,
  ],
  providers: [
    { provide: 'isBrowser', useValue: isBrowser },
    { provide: 'isNode', useValue: isNode },
    { provide: 'req', useFactory: () => Zone.current.get('req') || {} },
    { provide: 'res', useFactory: () => Zone.current.get('res') || {} },
  ],
  bootstrap: [AppComponent],
})
export class ServerModule { }
