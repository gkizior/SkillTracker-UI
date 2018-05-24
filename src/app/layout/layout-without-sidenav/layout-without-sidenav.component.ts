import { Component } from '@angular/core';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-layout-without-sidenav',
  templateUrl: './layout-without-sidenav.component.html',
  styles: [':host { display: block; }']
})
export class LayoutWithoutSidenavComponent {
  // Prevent "blink" effect
  public initialized = false;

  constructor(private layoutService: LayoutService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.initialized = true;

      // Enshure that we have not '.layout-expanded' class on the html element
      this.layoutService._removeClass('layout-expanded');

      this.layoutService.init();
      this.layoutService.update();
      this.layoutService.setAutoUpdate(true);
    });
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.layoutService.destroy();
    });
  }
}
