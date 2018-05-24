import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'sidenav-router-link',
  template: `
<a
  [routerLink]="route"
  [queryParams]="queryParams"
  [fragment]="fragment"
  [queryParamsHandling]="queryParamsHandling"
  [preserveFragment]="preserveFragment"
  [skipLocationChange]="skipLocationChange"
  [replaceUrl]="replaceUrl"
  class="sidenav-link"
  [ngClass]="linkClass">
  <i class="sidenav-icon" *ngIf="icon" [ngClass]="icon"></i>
  <div><ng-content></ng-content></div>
  <div *ngIf="badge" class="ml-auto pl-1"><div class="badge" [ngClass]="badgeClass">{{badge}}</div></div>
</a>
  `,
  host: { '[class.sidenav-item]': 'true', '[class.d-block]': 'true' }
})
export class SidenavRouterLinkComponent {
  @Input() icon: String;
  @Input() linkClass: String = '';
  @Input() badge: any = null;
  @Input() badgeClass: String = '';
  @Input() @HostBinding('class.disabled') disabled: boolean = false;
  @Input() @HostBinding('class.active') active: boolean = false;

  @Input() route: any[] | string;
  @Input() queryParams: Object;
  @Input() fragment: string;
  @Input() queryParamsHandling: any;
  @Input() preserveFragment: boolean;
  @Input() skipLocationChange: boolean;
  @Input() replaceUrl: boolean;
}
