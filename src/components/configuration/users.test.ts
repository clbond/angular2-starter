import {
  async,
  inject,
  TestBed,
} from '@angular/core/testing';

import {Subject, Observable} from 'rxjs';

import {configureTests} from '../../tests.configure';

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
});
