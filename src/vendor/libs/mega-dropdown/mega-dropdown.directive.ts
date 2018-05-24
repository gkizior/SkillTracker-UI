import { Directive, ElementRef, Input, OnDestroy, NgZone } from '@angular/core';

const MegaDropdown = require('./mega-dropdown.js').MegaDropdown;

@Directive({
  selector: '[megaDropdown]',
  exportAs: 'megaDropdown'
})
export class MegaDropdownDirective implements OnDestroy {
  public megaDropdown;

  @Input() trigger: String = 'click';

  constructor(private el: ElementRef, private zone: NgZone) {
    this.el.nativeElement.classList.add('mega-dropdown');
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.megaDropdown = new MegaDropdown(
        this.el.nativeElement.querySelector('.dropdown-toggle'),
        { trigger: this.trigger }
      );
    });
  }

  ngOnDestroy() {
    if (this.megaDropdown) this.zone.runOutsideAngular(() => this.megaDropdown.destroy());
    this.megaDropdown = null;
    this.el = null;
  }
}
