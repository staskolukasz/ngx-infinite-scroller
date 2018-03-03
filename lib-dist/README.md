# ngx-infinite-scroller

Infinite reverse scroll directive for Angular 5

## Installation

Run `npm install ngx-infinite-scroller --save` to install the library.

## Usage

Include `NgxInfiniteScrollerModule` in your module

```typescript
import { NgxInfiniteScrollerModule } from 'ngx-infinite-scroller';

@NgModule({
  declarations: [
  ],
  imports: [
    NgxInfiniteScrollerModule,
  ],
  providers: [],
  bootstrap: [
  ]
})
```

Include `ngxInfiniteScroller` directive in your `*.component.html` file

```html
<ul id="scroller"
    ngxInfiniteScroller
    (onScrollUp)="onScrollUp()">
  <li *ngFor="let item of news">
    {{item.title}}
  </li>
</ul>
```
Handle `onScrollUp` action in your `*.component.ts` file

```typescript
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/skipWhile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public news: Array<any> = [];

  public httpReqestInProgress: boolean = false;

  private currentPage = 1;

  constructor(private http: HttpClient) { }

  public ngOnInit() { }

  public onScrollUp(): void {
    this.getNews(this.currentPage)
      .skipWhile(() => this.httpReqestInProgress)
      .do(() => { this.httpReqestInProgress = true })
      .subscribe((news) => {
        this.currentPage++;
        this.news = this.news.concat(news);
        this.httpReqestInProgress = false;
      });
  }

  private getNews(page: number = 1) {
    return this.http.get(`https://node-hnapi.herokuapp.com/news?page=${page}`);
  }
}
```

## Development environment

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `npm run build:library` to build the library. The build artifacts will be stored in the `list-dist/` directory.