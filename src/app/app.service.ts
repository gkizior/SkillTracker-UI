import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class AppService {
  constructor(private titleService: Title) {}

  // Set page title
  set pageTitle(value) {
    this.titleService.setTitle(`${value} - WMP Skill Tracker`);
  }

  // Check for RTL layout
  get isRTL() {
    return (
      document.documentElement.getAttribute('dir') === 'rtl' ||
      document.body.getAttribute('dir') === 'rtl'
    );
  }

  // Check if IE10
  get isIE10() {
    return (
      typeof document['documentMode'] === 'number' &&
      document['documentMode'] === 10
    );
  }

  // Layout navbar color
  get layoutNavbarBg() {
    return 'navbar-theme';
  }

  // Layout sidenav color
  get layoutSidenavBg() {
    return 'sidenav-theme';
  }

  // Layout footer color
  get layoutFooterBg() {
    return 'footer-theme';
  }
}
