import { Routes, RouterModule } from '@angular/router';

import {
  RioHelloPageComponent,
  ConfigurationComponent,
  MonitoringComponent,
} from '../pages';

const SAMPLE_APP_ROUTES: Routes = [{
  path: '',
  component: RioHelloPageComponent,
}, {
  path: 'configuration',
  component: ConfigurationComponent,
}, {
  path: 'monitoring',
  component: MonitoringComponent,
}];

export const appRoutingProviders: any[] = [];

export const routing = RouterModule.forRoot(SAMPLE_APP_ROUTES);
