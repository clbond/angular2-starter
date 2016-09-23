import {ChangeDetectorRef, Component} from '@angular/core';

import {Observable} from 'rxjs';

import {User, UserService} from '../../services';

export enum State {
  Create,
  Edit,
  View,
}

@Component({
  selector: 'configuration-users',
  template: require('./users.html'),
  styles: [require('./users.css')],
})
export class ConfigurationUsers {
  private State = State;
  private state = State.View;

  private currentUser: User;

  private users: Array<User>;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private service: UserService) {}

  private ngOnInit() {
    this.service.list().subscribe(users => {
      this.users = users;
      this.changeDetector.detectChanges();
    });
  }

  private onCreate() {
    this.state = State.Create;

    this.currentUser = {};
  }

  private onEdit(user: User) {
    this.state = State.Edit;

    this.currentUser = Object.assign({}, user);
  }

  private onFinishCreate(user: User) {
    this.service.create(user)
      .subscribe(
        value => {
          this.users.push(value);

          this.state = State.View;
        },
        error => {
          console.error('Failed to create user', error);
        });
  }

  private onFinishEdit(user: User) {
    this.service.edit(user)
      .subscribe(
        value => {
          const existingUser = this.users.find(u => u.id === user.id);
          if (existingUser == null) {
            throw new Error(`Cannot find existing user with ID ${user.id}`);
          }

          Object.assign(existingUser, value);

          this.state = State.View;
        },
        error => {
          console.error('Failed to create user', error);
        });
  }

  private onCancel() {
    this.state = State.View;

    this.currentUser = null;
  }
}