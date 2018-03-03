import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public items: Array<any> = [];

  public currentPage = 1;

  public lock: boolean = false;

  constructor(private http: HttpClient) { }

  public ngOnInit() { }

  public onScrollUp(): void {
    if (this.lock) { return; }

    this.getNews(this.currentPage)
      .do(() => { this.lock = true })
      .subscribe((news) => {
        this.currentPage++;
        this.items = this.items.concat(news);
        this.lock = false;
      });
  }

  private getNews(page: number = 1) {
    return this.http.get(`https://node-hnapi.herokuapp.com/news?page=${page}`);
  }
}
