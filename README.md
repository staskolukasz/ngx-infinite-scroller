# ngx-infinite-scroll

Infinite reverse scroll directive for Angular 5

## Usage

Run `npm run build:library` to build the library. The build artifacts will be stored in the `list-dist/` directory.

Include `NgxInfiniteScrollModule` in your module

```typescript
@NgModule({
  declarations: [
  ],
  imports: [
    NgxInfiniteScrollModule,
  ],
  providers: [],
  bootstrap: [
  ]
})
```

Include `ngxInfiniteScroll` directive in your `*.component.html` file

```html
<ul id="scroller"
    ngxInfiniteScroll
    (onScrollUp)="onScrollUp()">
  <li *ngFor="let item of news">
    {{item.title}}
  </li>
</ul>
```
Handle `onScrollUp` action in your `*.component.ts` file

```typescript
export class AppComponent implements OnInit {

  public news: Array<any> = [];

  public httpReqestInProgress: boolean = false;

  private currentPage = 1;

  constructor(private http: HttpClient) { }

  public ngOnInit() { }

  public onScrollUp(): void {
    if (this.httpReqestInProgress) { return; }

    this.getNews(this.currentPage)
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
