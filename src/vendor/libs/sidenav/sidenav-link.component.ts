import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'sidenav-link',
  template: `
<a [href]="href" [target]="target" class="sidenav-link" [ngClass]="linkClass">
  <i class="sidenav-icon" *ngIf="icon" [ngClass]="icon"></i>
  <div><ng-content></ng-content></div>
  <div *ngIf="badge" class="ml-auto pl-1"><div class="badge" [ngClass]="badgeClass">{{badge}}</div></div>
</a>
  `,
  host: { '[class.sidenav-item]': 'true', '[class.d-block]': 'true' }
})
export class SidenavLinkComponent {
  @Input() href: String;
  @Input() icon: String;
  @Input() target: String = '_self';
  @Input() linkClass: String = '';
  @Input() badge: any = null;
  @Input() badgeClass: String = '';
  @Input() @HostBinding('class.disabled') disabled: boolean = false;
  @Input() @HostBinding('class.active') active: boolean = false;
}
