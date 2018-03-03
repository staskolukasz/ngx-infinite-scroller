import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { NgxInfiniteScrollerDirective } from './ngx-infinite-scroller.directive';

@NgModule({
  declarations: [
    NgxInfiniteScrollerDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NgxInfiniteScrollerDirective
  ],
  providers: [],
  bootstrap: []
})
export class NgxInfiniteScrollerModule { }
