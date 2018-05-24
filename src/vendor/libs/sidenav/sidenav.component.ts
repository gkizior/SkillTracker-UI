import { Component, ElementRef, Input, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';

import PerfectScrollbar from 'perfect-scrollbar';
const SideNav = require('./sidenav.js').SideNav;

@Component({
  selector: 'sidenav',
  exportAs: 'sidenav',
  template: '<ng-content></ng-content>',
  styleUrls: ['../ngx-perfect-scrollbar/ngx-perfect-scrollbar.scss']
})
export class SidenavComponent implements OnDestroy {
  public sidenav;

  @Input() orientation: String = 'vertical';
  @Input() animate: Boolean = true;
  @Input() accordion: Boolean = true;
  @Input() closeChildren: Boolean = false;
  @Input() showDropdownOnHover: Boolean = false;

  @Input() onOpen: Function;
  @Input() onOpened: Function;
  @Input() onClose: Function;
  @Input() onClosed: Function;

  constructor(private el: ElementRef, private zone: NgZone, private ref: ChangeDetectorRef) {
    this.ref.detach();

    this.el.nativeElement.classList.add('sidenav');
    this.el.nativeElement.classList.add(`sidenav-${this.orientation === 'horizontal' ? 'horizontal' : 'vertical'}`);
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.sidenav = new SideNav(this.el.nativeElement, {
        orientation: this.orientation,
        animate: this.animate,
        accordion: this.accordion,
        closeChildren: this.closeChildren,
        showDropdownOnHover: this.showDropdownOnHover,

        onOpen: this.onOpen,
        onOpened: this.onOpened,
        onClose: this.onClose,
        onClosed: this.onClosed
      }, PerfectScrollbar);
    });
  }

  ngOnDestroy() {
    if (this.sidenav) this.zone.runOutsideAngular(() => this.sidenav.destroy());
    this.sidenav = null;
    this.el = null;
  }
}
