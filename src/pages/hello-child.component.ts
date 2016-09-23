import {Input, Component} from '@angular/core';

import {Observable} from 'rxjs';

@Component({
  selector: 'hello-child',
  template: `
    <div>
      Counter: {{counter | async}}
    </div>
  `
})
export class HelloChildComponent {
  @Input() private counter: Observable<number>;
}