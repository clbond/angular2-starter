import {Input, Component} from '@angular/core';

import {Observable} from 'rxjs';

@Component({
  selector: 'hello-child',
  template: `
    <div>
      Counter: {{mappedCounter | async}}
    </div>
  `
})
export class HelloChildComponent {
  @Input() private counter: Observable<number>;

  private mappedCounter: Observable<number>;

  private ngOnChanges() {
    this.mappedCounter = this.counter.filter(v => (v % 2) === 0);
  }
}