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

  public ngOnInit() {
    this.getNews(this.currentPage)
      .subscribe((news) => {
        this.currentPage++;
        this.news = this.news.concat(news);
      });
  }

  public onScrollUp(): void {
    this.getNews(this.currentPage)
      .skipWhile(() => this.httpReqestInProgress)
      .do(() => { this.httpReqestInProgress = true })
      .subscribe((news: any[]) => {
        this.currentPage++;
        this.news = news.concat(this.news);
        this.httpReqestInProgress = false;
      });
  }

  public onScrollDown(): void {
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
