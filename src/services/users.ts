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

  list(): Observable<Array<User>> {
    const uri = this.configurationService.getServiceLocation('/people');

    const observable = this.http.get(uri, {
      headers: new Headers({'Accept': 'application/json'})
    });

    return observable.map(r => <Array<User>> r.json());
  }
}