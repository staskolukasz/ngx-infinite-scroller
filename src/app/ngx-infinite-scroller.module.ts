import { NgModule } from '@angular/core';

import { NgxInfiniteScrollerDirective } from './ngx-infinite-scroller.directive';
import { DirectiveStateService } from './directive-state.service';

@NgModule({
  declarations: [
    NgxInfiniteScrollerDirective
  ],
  imports: [
  ],
  exports: [
    NgxInfiniteScrollerDirective
  ],
  providers: [
    DirectiveStateService
  ],
  bootstrap: []
})
export class NgxInfiniteScrollerModule { }
