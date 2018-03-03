import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxInfiniteScrollerDirective } from './ngx-infinite-scroller.directive';

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
  providers: [],
  bootstrap: []
})
export class NgxInfiniteScrollerModule { }
