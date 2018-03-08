import {
  Directive,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  Renderer2,
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

import { ScrollPosition } from './model/scroll-position.model';

import { DirectiveContext } from './implementation/directive-context';
import { ScrollingToTop } from './implementation/scrolling-to-top';
import { ScrollingToBottom } from './implementation/scrolling-to-bottom';
import { ScrollingToBoth } from './implementation/scrolling-to-both';

@Directive({
  selector: '[ngxInfiniteScroller]'
})
export class NgxInfiniteScrollerDirective
  extends DirectiveContext
  implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  public strategy: string = 'scrollingToBottom';

  @Input()
  public scrollbarAnimationInterval = 100;

  @Input()
  public scrollDebounceTimeAfterDOMMutation = 100;

  @Input()
  public scrollDebounceTimeAfterDOMMutationOnInit = 500;

  @Input()
  public scrollUpPercentilePositionTrigger = 2;

  @Input()
  public scrollDownPercentilePositionTrigger = 98;

  @Output()
  public onScrollUp: EventEmitter<null> = new EventEmitter<null>();

  @Output()
  public onScrollDown: EventEmitter<null> = new EventEmitter<null>();

  public previousScrollTop: number;

  public previousScrollHeight: number;

  public scrollStreamActive: boolean;

  private initMode: boolean;

  private domMutationObserver: MutationObserver;

  private domMutationEmitter: Subject<MutationRecord[]>;

  private scrollChanged: Observable<Event>;

  private get scrollPairChanged(): Observable<ScrollPosition[]> {
    if (this.scrollChanged) {
      return this.scrollChanged
        .takeWhile(() => this.scrollStreamActive)
        .map((e: any) => {
          return <ScrollPosition>{
            scrollHeight: e.target.scrollHeight,
            scrollTop: e.target.scrollTop,
            clientHeight: e.target.clientHeight,
          };
        })
        .pairwise()
        .debounceTime(this.scrollbarAnimationInterval);
    }
  }

  private get scrollDirectionChanged(): Observable<ScrollPosition[]> {
    return this.scrollingStrategy.scrollDirectionChanged(this.scrollPairChanged);
  }

  private get scrollRequestZoneChanged(): Observable<ScrollPosition[]> {
    return this.scrollingStrategy.scrollRequestZoneChanged(this.scrollDirectionChanged)
      .do(() => {
        this.previousScrollTop = this.el.nativeElement.scrollTop;
        this.previousScrollHeight = this.el.nativeElement.scrollHeight;
      });
  }

  constructor(
    el: ElementRef,
    renderer: Renderer2
  ) {
    super(el, renderer);
  }

  public ngOnInit(): void {
    switch (this.strategy) {
      case 'scrollingToBoth':
        this.scrollingStrategy = new ScrollingToBoth(this);
        break;
      case 'scrollingToTop':
        this.scrollingStrategy = new ScrollingToTop(this);
        break;
      case 'scrollingToBottom': default:
        this.scrollingStrategy = new ScrollingToBottom(this);
        break;
    }

    this.domMutationEmitter = new Subject<MutationRecord[]>();

    this.initMode = true;
    this.scrollStreamActive = false;

    this.registerScrollEventHandler();
    this.registerMutationObserver();
    this.registerInitialScrollPostionHandler();
    this.registerPreviousScrollPositionHandler();
  }

  public ngAfterViewInit(): void {
    this.registerScrollSpy();
  }

  public ngOnDestroy(): void {
    this.domMutationObserver.disconnect();
  }

  public scrollTo(position: number): void {
    this.scrollStreamActive = false;
    this.renderer.setProperty(this.el.nativeElement, 'scrollTop', position);
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
      .debounceTime(this.scrollDebounceTimeAfterDOMMutationOnInit)
      .subscribe(() => {
        this.scrollingStrategy.setInitialScrollPosition();
        this.initMode = false;
      });
  }

  private registerPreviousScrollPositionHandler(): void {
    Observable
      .zip(this.scrollRequestZoneChanged, this.domMutationEmitter)
      .skipWhile(() => this.initMode)
      .debounceTime(this.scrollDebounceTimeAfterDOMMutation)
      .subscribe(() => {
        this.scrollingStrategy.setPreviousScrollPosition();
      });
  }

  private registerScrollSpy(): void {
    this.scrollRequestZoneChanged.subscribe(() => {
      this.scrollingStrategy.askForUpdate();
    });
  }
}
