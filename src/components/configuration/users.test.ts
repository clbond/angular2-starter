import {
  async,
  inject,
  TestBed,
} from '@angular/core/testing';

import {Subject, Observable} from 'rxjs';

import {configureTests} from '../../tests.configure';

import {ConfigurationUsers} from './users';
import {User, UserService} from '../../services';
import {RioAppModule} from '../../app/app';

describe('Users list', () => {
  let fixture;

  class MockService {
    public listCalled = false;

    list(): Observable<Array<User>> {
      this.listCalled = true;

      return Observable.from([[
        {id: 0, firstname: 'Chris', lastname: 'Bond'},
      ]]);
    }

    create(user: User): Observable<User> {
      throw new Error();
    }
    edit(user: User): Observable<User> {
      throw new Error();
    }
  };

  let mockService: MockService;

  beforeEach(done => {
    mockService = new MockService();

    const configure = (testBed: TestBed) => {
      testBed.configureTestingModule({
        imports: [
          RioAppModule,
        ],
        providers: [
          {provide: UserService, useValue: mockService},
        ]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(ConfigurationUsers);
      fixture.detectChanges();
      done();
    });
  });

  it('should request list of users on initialization',
    async(inject([], () => {
      expect(mockService.listCalled).toBe(true);
    })));

  // it('should be able to create a new user',
  //   async(inject([], () => {
  //     fixture.whenStable().then(() => {
  //     });
  //   })));

  // it('should be able to edit an existing user',
  //   () => {

  //   });
});
