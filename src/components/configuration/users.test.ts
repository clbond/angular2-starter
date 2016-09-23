import {
  async,
  fakeAsync,
  inject,
  tick,
  flushMicrotasks,
  TestBed,
} from '@angular/core/testing';

import {Subject, Observable} from 'rxjs';

import {
  configureTests,
} from '../../tests.harness';

import {ConfigurationUsers, State} from './users';
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

    public createUser: User;

    create(user: User): Observable<User> {
      this.createUser = user;

      return Observable.from([user]);
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

  it('should go into Create mode when the Create button is clicked',
    async(inject([], () => {
      fixture.whenStable().then(() => {
        const {nativeElement} = fixture.debugElement;

        const createButton = nativeElement.querySelector('[qa-id="create"]');
        expect(createButton).not.toBeNull();

        createButton.click();

        expect(fixture.componentInstance.state).toBe(State.Create);
      });
    })));

  it('should go into Edit mode when the Edit button is clicked',
    async(inject([], () => {
      fixture.whenStable().then(() => {
        const {nativeElement} = fixture.debugElement;

        const editButton = nativeElement.querySelector('[qa-id="edit"]');
        expect(editButton).not.toBeNull();

        editButton.click();

        expect(fixture.componentInstance.state).toBe(State.Edit);
      });
    })));

  it('should be able to fill in Create form and create a new user',
    fakeAsync(inject([], () => {
      fixture.whenStable().then(() => {
        const {nativeElement} = fixture.debugElement;

        fixture.componentInstance.onCreate({
          id: null,
          firstname: 'Chris',
          lastname: 'Bond'
        });

        fixture.detectChanges();

        const acceptButton = nativeElement.querySelector('[qa-id="accept"]');
        expect(acceptButton).not.toBeNull();

        acceptButton.click();

        tick();
        flushMicrotasks();

        expect(mockService.createUser).not.toBeNull();
        expect(mockService.createUser.id).toBeNull();
        expect(mockService.createUser.firstname).toBe('Chris');
        expect(mockService.createUser.lastname).toBe('Bond');
      });
    })));
});
