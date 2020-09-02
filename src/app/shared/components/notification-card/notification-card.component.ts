import { Component, Input } from '@angular/core';

@Component({
  selector: 'notification-card-cmp',
  template: `
    <div class="row">
      <div class="card">
        <div class="content">
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [``],
})
export class NotificationCardComponent {
  @Input() message: string;
}
