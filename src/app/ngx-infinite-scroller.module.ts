import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxInfiniteScrollerDirective } from './ngx-infinite-scroller.directive';
import { DirectiveStateService } from './directive-state.service';

@NgModule({
  declarations: [
    NgxInfiniteScrollerDirective
  ],
  imports: [
    BrowserModule
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
