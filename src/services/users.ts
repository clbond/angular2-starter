import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import {Observable} from 'rxjs';

import {ConfigurationService} from './configuration';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
}

@Injectable()
export class UserService {
  constructor(
    private configurationService: ConfigurationService,
    private http: Http
  ) {}

  private get peopleUri(): string {
    return this.configurationService.getServiceLocation('/people');
  }

  call<T>(httpMethod: Function, ...args): Observable<T> {
    const httpArguments = [this.peopleUri, ...args, {
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })}];

    const observable =
      httpMethod.bind(this.http).apply(this.http, httpArguments);

    return observable.map(r => <T> r.json());
  }

  list(): Observable<Array<User>> {
    return this.call<Array<User>>(this.http.get);
  }

  create(user: User): Observable<User> {
    return this.call<User>(this.http.post, JSON.stringify(user));
  }

  edit(user: User): Observable<User> {
    return this.call<User>(this.http.put, JSON.stringify(user));
  }
}