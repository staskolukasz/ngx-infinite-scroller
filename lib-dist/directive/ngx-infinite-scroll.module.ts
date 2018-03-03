import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { NgxInfiniteScrollDirective } from './ngx-infinite-scroll.directive';

@NgModule({
  declarations: [
    NgxInfiniteScrollDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NgxInfiniteScrollDirective
  ],
  providers: [],
  bootstrap: []
})
export class NgxInfiniteScrollModule { }
