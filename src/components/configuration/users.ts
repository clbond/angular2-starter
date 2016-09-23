import {Component} from '@angular/core';

import {Observable} from 'rxjs';

import {User, UserService} from '../../services';

@Component({
  selector: 'configuration-users',
  template: require('./users.html'),
})
export class ConfigurationUsers {
  private users: Observable<Array<User>>;

  constructor(private service: UserService) {}

  private ngOnInit() {
    this.users = this.service.list();
  }
}