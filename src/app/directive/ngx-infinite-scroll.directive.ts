import {
  Directive,
  AfterViewInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  NgZone,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/fromEvent';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/debounceTime';

import { ReverseScrollUtil } from './ngx-infinite-scroll.util';

import { ScrollPosition } from './model/scroll-position.model';
import { initialScrollPosition } from './model/scroll-position.model';

@Directive({
  selector: '[ngxInfiniteScroll]'
})
export class NgxInfiniteScrollDirective implements AfterViewInit, OnInit, OnDestroy {

  @Input()
  public scrollbarAnimationInterval = 100;

  @Input()
  public scrollDebounceTimeAfterDOMMutation = 300;

  @Input()
  public scrollUpPercentilePositionTrigger = 5;

  @Output()
  public onScrollUp: EventEmitter<null> = new EventEmitter<null>();

  private scrollChanged: Observable<Event>;

  private get scrollPositionChanged(): Observable<ScrollPosition[]> {
    if (this.scrollChanged) {
      return this.scrollChanged
        .takeWhile(() => this.scrollStreamActive)
        .map((e: any) => {
          return <ScrollPosition>{
            scrollHeight: e.target.scrollHeight,
            scrollTop: e.target.scrollTop,
            clientHeight: e.target.clientHeight,
          }
        })
        .pairwise()
        .debounceTime(this.scrollbarAnimationInterval)
    }
  }

  private get scrollDownChanged(): Observable<ScrollPosition[]> {
    return this.scrollPositionChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return ReverseScrollUtil.wasScrolledDown(
          scrollPositions[0],
          scrollPositions[1]
        );
      });
  }

  private get scrollUpChanged(): Observable<ScrollPosition[]> {
    return this.scrollPositionChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return ReverseScrollUtil.wasScrolledUp(
          scrollPositions[0],
          scrollPositions[1]
        );
      });
  }

  private get scrollRequestZoneEntered(): Observable<ScrollPosition[]> {
    return this.scrollUpChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return ReverseScrollUtil.isScrollUpEnough(
          scrollPositions[0],
          this.scrollUpPercentilePositionTrigger
        );
      })
  }

  private get requestDispatcher(): Observable<ScrollPosition[]> {
    return this.scrollRequestZoneEntered
      .do(() => {
        this.previousScrollTop = this.el.nativeElement.scrollTop;
        this.previousScrollHeight = this.el.nativeElement.scrollHeight;
      })
      .startWith([initialScrollPosition, initialScrollPosition]);
  }

  private previousScrollTop: number;

  private previousScrollHeight: number;

  private domMutationObserver: MutationObserver;

  private domMutationEmitter: Subject<MutationRecord[]>;

  private scrollStreamActive: boolean;

  private initMode: boolean;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private zone: NgZone
  ) { }

  public ngOnInit(): void {
    this.domMutationEmitter = new Subject<MutationRecord[]>();

    this.initMode = true;
    this.scrollStreamActive = false;

    this.registerScrollEventHandler();
    this.registerMutationObserver();
    this.registerInitialScrollPostionHandler();
    this.registerRequestScrollPositionHandler();
  }

  public ngAfterViewInit(): void {
    this.registerRequestDispatcher();
  }

  public ngOnDestroy(): void {
    this.domMutationObserver.disconnect();
  }

  public scrollTo(scrollTop?: number): void {
    this.scrollStreamActive = false;
    this.renderer.setProperty(
      this.el.nativeElement,
      'scrollTop',
      scrollTop || this.el.nativeElement.scrollHeight
    );
    this.scrollStreamActive = true;
  }

  private registerScrollEventHandler(): void {
    this.scrollChanged = Observable.fromEvent(this.el.nativeElement, 'scroll');
  }

  private registerMutationObserver(): void {
    this.domMutationObserver = new MutationObserver(
      (mutations: MutationRecord[]) => {
        this.domMutationEmitter.next(mutations);
      });

    const config = { attributes: true, childList: true, characterData: true };
    this.domMutationObserver.observe(this.el.nativeElement, config);
  }

  private registerInitialScrollPostionHandler(): void {
    this.domMutationEmitter
      .takeWhile(() => this.initMode)
      .debounceTime(this.scrollDebounceTimeAfterDOMMutation)
      .subscribe(() => {
        this.scrollTo();
        this.initMode = false;
      });
  }

  private registerRequestScrollPositionHandler(): void {
    Observable
      .zip(this.requestDispatcher, this.domMutationEmitter)
      .skipWhile(() => this.initMode)
      .debounceTime(this.scrollDebounceTimeAfterDOMMutation)
      .subscribe(() => {
        const newScrollPosition = this.previousScrollTop +
          (this.el.nativeElement.scrollHeight - this.previousScrollHeight);
        this.scrollTo(newScrollPosition);
      });
  }

  private registerRequestDispatcher(): void {
    this.requestDispatcher.subscribe(() => {
      this.onScrollUp.next();
    });
  }
}
