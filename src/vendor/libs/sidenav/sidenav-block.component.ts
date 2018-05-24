import { Component } from '@angular/core';

@Component({
  selector: 'sidenav-block',
  template: `
  <ng-content></ng-content>
  `,
  host: { '[class.sidenav-block]': 'true', '[class.d-block]': 'true' }
})
export class SidenavBlockComponent {
}
