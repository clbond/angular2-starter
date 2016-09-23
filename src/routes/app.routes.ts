import { Routes, RouterModule } from '@angular/router';

import {
  RioHelloPageComponent,
  ConfigurationComponent,
  MonitoringComponent,
} from '../pages';

import {
  ConfigurationGroups,
  ConfigurationUsers
} from '../components';

const SAMPLE_APP_ROUTES: Routes = [{
  path: '',
  component: RioHelloPageComponent,
}, {
  path: 'configuration',
  component: ConfigurationComponent,
  children: [{
      path: '',
      redirectTo: 'groups',
    }, {
      path: 'groups',
      component: ConfigurationGroups,
    }, {
      path: 'users',
      component: ConfigurationUsers,
    },
  ],
}, {
  path: 'monitoring',
  component: MonitoringComponent,
}];

export const appRoutingProviders: any[] = [];

export const routing = RouterModule.forRoot(SAMPLE_APP_ROUTES);
