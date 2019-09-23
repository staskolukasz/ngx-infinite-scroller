import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { share, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public news: Array<any> = [];

  private currentPage = 1;

  private request$: Observable<any>;

  constructor(private http: HttpClient) { }

  public ngOnInit() {
    this.getNews(this.currentPage)
      .pipe(finalize(() => this.onFinalize()))
      .subscribe((news) => {
        this.currentPage++;
        this.news = this.news.concat(news);
      });
  }

  public onScrollUp(): void {
    this.getNews(this.currentPage)
      .pipe(finalize(() => this.onFinalize()))
      .subscribe((news) => {
        this.currentPage++;
        this.news = news.concat(this.news);
      });
  }

  public onScrollDown(): void {
    this.getNews(this.currentPage)
      .pipe(finalize(() => this.onFinalize()))
      .subscribe((news) => {
        this.currentPage++;
        this.news = this.news.concat(news);
      });
  }

  // Prevent duplicate requests on scroll.
  // More: https://stackoverflow.com/a/50865911/6441494
  private getNews(page: number = 1): Observable<any> {
    if (this.request$) {
      return this.request$;
    } else {
      this.request$ = this.http.get(`https://node-hnapi.herokuapp.com/news?page=${page}`).pipe(share());
      return this.request$;
    }
  }

  private onFinalize(): void {
    this.request$ = null;
  }
}
