import {
  Component,
  ViewEncapsulation,
  NgModule
} from '@angular/core';

import {
  LocationStrategy,
  HashLocationStrategy,
} from '@angular/common';

import {HttpModule} from '@angular/http';

import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  routing,
  appRoutingProviders
} from '../routes/app.routes';

import {
  RioHelloPageComponent,
  ConfigurationComponent,
  MonitoringComponent,
  HelloChildComponent,
} from '../pages';

import {
  ConfigurationGroups,
  ConfigurationUsers,
  UserEditor,
} from '../components';

import {
  ConfigurationService,
  UserService
} from '../services';

import {BrowserModule} from '@angular/platform-browser';

@Component({
  selector: 'rio-app',
  // Global styles imported in the app component.
  encapsulation: ViewEncapsulation.None,
  styles: [
    require('../styles/index.css'),
    require('./app.css'),
  ],
  template: require('./app.html'),
})
export class RioAppComponent {};

@NgModule({
  imports: [
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    routing
  ],
  declarations: [
    RioAppComponent,
    RioHelloPageComponent,
    ConfigurationComponent,
    MonitoringComponent,
    ConfigurationGroups,
    ConfigurationUsers,
    HelloChildComponent,
    UserEditor,
  ],
  providers: [
    appRoutingProviders,
    UserService,
    ConfigurationService,
  ],
  bootstrap: [RioAppComponent]
})
export class RioAppModule {};
