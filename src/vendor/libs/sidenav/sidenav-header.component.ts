import { Component } from '@angular/core';

@Component({
  selector: 'sidenav-header',
  template: `
  <ng-content></ng-content>
  `,
  host: { '[class.sidenav-header]': 'true', '[class.d-block]': 'true' }
})
export class SidenavHeaderComponent {
}
