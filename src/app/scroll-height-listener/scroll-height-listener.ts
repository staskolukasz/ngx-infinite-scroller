import { NgxInfiniteScrollerDirective } from '../ngx-infinite-scroller.directive';
import { DirectiveStateService } from '../directive-state.service';

export class ScrollHeightListener {

  private DEFAULT_REQUEST_TIMEOUT = 30000;

  private listener: number;

  private httpRequestTimeout: any;

  constructor(
    private directive: NgxInfiniteScrollerDirective,
    private state: DirectiveStateService
  ) { }

  public start(): void {
    this.listener = window.requestAnimationFrame(this.listen.bind(this));

    if (!this.httpRequestTimeout) {
      this.httpRequestTimeout = setTimeout(
        () => {
          this.stopIfRequestTimeout();
        },
        this.DEFAULT_REQUEST_TIMEOUT
      );
    }
  }

  public stop(): void {
    window.cancelAnimationFrame(this.listener);
    clearTimeout(this.httpRequestTimeout);
    this.httpRequestTimeout = null;
  }

  private listen(): void {
    if (this.state.previousScrollHeight !== this.state.scrollHeight) {
      this.stop();
      this.directive.onScrollbarHeightChanged();
    } else {
      this.start();
    }
  }

  private stopIfRequestTimeout(): void {
    if (!this.state.previousScrollPositionpUpdated) {
      this.stop();
    }
  }
}
