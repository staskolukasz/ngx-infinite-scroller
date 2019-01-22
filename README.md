# ngx-infinite-scroller

Infinite and bidirectional scroll directive for Angular 7

All notable changes to this project are documented in [CHANGELOG.md](https://github.com/staskolukasz/ngx-infinite-scroller/blob/master/CHANGELOG.md) file.

## Installation

Run `npm install ngx-infinite-scroller --save` to install the library.

## Usage

### *.module.ts configuration

Include `NgxInfiniteScrollerModule` in your module

```typescript
import { NgxInfiniteScrollerModule } from 'ngx-infinite-scroller';

@NgModule({
  declarations: [],
  imports: [
    NgxInfiniteScrollerModule,
  ],
  providers: [],
  bootstrap: []
})
```

### *.component.html configuration

Include `ngxInfiniteScroller` directive in your `*.component.html` file

```html
<ul id="scroller"
    ngxInfiniteScroller
    strategy="scrollingToBoth"
    (onScrollUp)="onScrollUp()"
    (onScrollDown)="onScrollDown()">
  <li class="news"
      *ngFor="let item of news">
    {{item.title}}
  </li>
</ul>
```
By default directive works as infinite scroll from the top to the bottom of your list. To switch to other modes, use input parameters like:
`strategy="scrollingToTop"`  
`strategy="scrollingToBottom"` (default)  
`strategy="scrollingToBoth"`

Default value of initial scroll position depends on strategy value:
`strategy="scrollingToTop"` -> `initialScrollPosition="BOTTOM"`
`strategy="scrollingToBoth"` -> `initialScrollPosition="MIDDLE"`
`strategy="scrollingToBottom"` -> `initialScrollPosition="TOP"`

it is aslo possible to customize the default behaviour using optional input field:  
`initialScrollPosition="TOP"`  
`initialScrollPosition="MIDDLE"`   
`initialScrollPosition="BOTTOM"`  
`initialScrollPosition="50"` (position in px)

### *.component.ts configuration

Handle `onScrollUp` and `onScrollDown` actions in your `*.component.ts` file

```typescript
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap, skipWhile } from 'rxjs/operators';

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

  public ngOnInit() {
    this.getNews(
      this.currentPage,
      (news) => {
        this.news = this.news.concat(news);
      });
  }

  public onScrollUp(): void {
    this.getNews(
      this.currentPage,
      (news) => {
        this.news = news.concat(this.news);
      });
  }

  public onScrollDown(): void {
    this.getNews(
      this.currentPage,
      (news) => {
        this.news = this.news.concat(news);
      });
  }

  private getNews(page: number = 1, saveResultsCallback: (news) => void) {
    return this.http.get(`https://node-hnapi.herokuapp.com/news?page=${page}`).pipe(
      skipWhile(() => this.httpReqestInProgress),
      tap(() => { this.httpReqestInProgress = true; })
    ).subscribe((news: any[]) => {
        this.currentPage++;
        saveResultsCallback(news);
        this.httpReqestInProgress = false;
      });
  }
}

```

### *.component.scss configuration

Add some styling in your `*.component.scss` file

```scss
#scroller {
  height: 100vh;
  width: 700px;
  overflow: scroll;
  padding: 0;
  margin: 0;
  list-style: none;
}

.news {
  padding: 30px;
}
```

## Development environment

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `npm run packagr` to build the library. The build artifacts will be stored in the `dist` directory.