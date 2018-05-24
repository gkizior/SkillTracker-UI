import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class LayoutService {
  constructor(private zone: NgZone) {}

  private exec(fn) {
    return window['layoutHelpers'] && this.zone.runOutsideAngular(fn);
  }

  public getLayoutSidenav() {
    return this.exec(() => window['layoutHelpers'].getLayoutSidenav()) || null;
  }

  public getSidenav() {
    return this.exec(() => window['layoutHelpers'].getSidenav()) || null;
  }

  public getLayoutNavbar() {
    return this.exec(() => window['layoutHelpers'].getLayoutNavbar()) || null;
  }

  public getLayoutContainer() {
    return this.exec(() => window['layoutHelpers'].getLayoutContainer()) || null;
  }

  public isSmallScreen() {
    return this.exec(() => window['layoutHelpers'].isSmallScreen());
  }

  public isLayout1() {
    return this.exec(() => window['layoutHelpers'].isLayout1());
  }

  public isCollapsed() {
    return this.exec(() => window['layoutHelpers'].isCollapsed());
  }

  public isFixed() {
    return this.exec(() => window['layoutHelpers'].isFixed());
  }

  public isOffcanvas() {
    return this.exec(() => window['layoutHelpers'].isOffcanvas());
  }

  public isNavbarFixed() {
    return this.exec(() => window['layoutHelpers'].isNavbarFixed());
  }

  public isReversed() {
    return this.exec(() => window['layoutHelpers'].isReversed());
  }

  public setCollapsed(collapsed, animate = true) {
    this.exec(() => window['layoutHelpers'].setCollapsed(collapsed, animate));
  }

  public toggleCollapsed(animate = true) {
    this.exec(() => window['layoutHelpers'].toggleCollapsed(animate));
  }

  public setPosition(fixed, offcanvas) {
    this.exec(() => window['layoutHelpers'].setPosition(fixed, offcanvas));
  }

  public setNavbarFixed(fixed) {
    this.exec(() => window['layoutHelpers'].setNavbarFixed(fixed));
  }

  public setReversed(reversed) {
    this.exec(() => window['layoutHelpers'].setReversed(reversed));
  }

  public update() {
    this.exec(() => window['layoutHelpers'].update());
  }

  public setAutoUpdate(enable) {
    this.exec(() => window['layoutHelpers'].setAutoUpdate(enable));
  }

  public on(event, callback) {
    this.exec(() => window['layoutHelpers'].on(event, callback));
  }

  public off(event) {
    this.exec(() => window['layoutHelpers'].off(event));
  }

  public init() {
    this.exec(() => window['layoutHelpers'].init());
  }

  public destroy() {
    this.exec(() => window['layoutHelpers'].destroy());
  }

  // Internal
  //

  public _redrawLayoutSidenav() {
    this.exec(() => window['layoutHelpers']._redrawLayoutSidenav());
  }

  public _removeClass(cls) {
    this.exec(() => window['layoutHelpers']._removeClass(cls));
  }
}
