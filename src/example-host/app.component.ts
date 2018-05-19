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
