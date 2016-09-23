import {
  Component,
  ViewEncapsulation,
  NgModule
} from '@angular/core';

import {
  LocationStrategy,
  HashLocationStrategy,
} from '@angular/common';

import {
  routing,
  appRoutingProviders
} from '../routes/app.routes';

import {
  RioHelloPageComponent,
  ConfigurationComponent,
  MonitoringComponent,
} from '../pages';

import {BrowserModule} from '@angular/platform-browser';

@Component({
  selector: 'rio-app',
  // Global styles imported in the app component.
  encapsulation: ViewEncapsulation.None,
  styles: [ require('../styles/index.css') ],
  template: require('./app.html'),
})
export class RioAppComponent {};

@NgModule({
  imports: [
    BrowserModule,
    routing
  ],
  declarations: [
    RioAppComponent,
    RioHelloPageComponent,
    ConfigurationComponent,
    MonitoringComponent,
  ],
  providers: [
    appRoutingProviders,
    //{provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [RioAppComponent]
})
export class RioAppModule {};
