import { Component } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-layout-footer',
  templateUrl: './layout-footer.component.html',
  styles: [':host { display: block; }'],
  host: { '[class.layout-footer]': 'true' }
})
export class LayoutFooterComponent {
  constructor(private appService: AppService) {}

  currentBg() {
    return `bg-${this.appService.layoutFooterBg}`;
  }
}
