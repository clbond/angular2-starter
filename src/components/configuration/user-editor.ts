import {
  Component,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';

import {User} from '../../services';

@Component({
  selector: 'user-editor',
  template: require('./user-editor.html'),
})
export class UserEditor {
  @Input() private user: User;

  @Output() private submit = new EventEmitter<User>();
  @Output() private cancel = new EventEmitter<void>();
}