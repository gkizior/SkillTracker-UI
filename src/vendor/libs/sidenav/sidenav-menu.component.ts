import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'sidenav-menu',
  template: `
<a href="#" class="sidenav-link sidenav-toggle" [ngClass]="linkClass">
  <i class="sidenav-icon" *ngIf="icon" [ngClass]="icon"></i>
  <div [innerHTML]="text"></div>
  <div *ngIf="badge" class="ml-auto pl-1"><div class="badge" [ngClass]="badgeClass">{{badge}}</div></div>
</a>
<div class="sidenav-menu">
  <ng-content></ng-content>
</div>
  `,
  host: { '[class.sidenav-item]': 'true', '[class.d-block]': 'true' }
})
export class SidenavMenuComponent {
  @Input() text: String;
  @Input() icon: String;
  @Input() linkClass: String = '';
  @Input() badge: any = null;
  @Input() badgeClass: String = '';
  @Input() @HostBinding('class.disabled') disabled: boolean = false;
  @Input() @HostBinding('class.active') active: boolean = false;
  @Input() @HostBinding('class.open') open: boolean = false;
}
