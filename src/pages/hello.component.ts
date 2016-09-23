import {Component} from '@angular/core';

import {Subject} from 'rxjs';

@Component({
  template: `
    <hello-child [counter]="counter"></hello-child>
  `
})
export class RioHelloPageComponent {
  private counter = new Subject<number>();

  private timer;

  private counterIncrement = 0;

  private ngOnInit() {
    this.timer = setInterval(
      () => {
        this.counter.next(this.counterIncrement++);
      },
      500);
  }

  private ngOnDestroy() {
    clearInterval(this.timer);
  }
}
