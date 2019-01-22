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

import { Observable, Subject, zip, fromEvent } from 'rxjs';

import { tap, map, pairwise, takeWhile, skipWhile, debounceTime } from 'rxjs/operators';

import { DirectiveStateService } from './directive-state.service';

import { ScrollPosition } from './model/scroll-position.model';
import { InitialScrollPosition } from './enum/initial-scroll-position-type.enum';

import { DirectiveContext } from './directive-context';
import { ScrollingToTop } from './scrolling-strategy/scrolling-to-top';
import { ScrollingToBottom } from './scrolling-strategy/scrolling-to-bottom';
import { ScrollingToBoth } from './scrolling-strategy/scrolling-to-both';

import { ScrollHeightListener } from './scroll-height-listener/scroll-height-listener';

@Directive({
  selector: '[ngxInfiniteScroller]'
})
export class NgxInfiniteScrollerDirective
  extends DirectiveContext
  implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  public strategy: string = 'scrollingToBottom';

  @Input()
  public initialScrollPosition: InitialScrollPosition | number = InitialScrollPosition.DEFAULT;

  @Input()
  public scrollbarAnimationInterval = 100;

  @Input()
  public scrollDebounceTimeAfterScrollHeightChanged = 50;

  @Input()
  public scrollDebounceTimeAfterDOMMutationOnInit = 1000;

  @Input()
  public scrollUpPercentilePositionTrigger = 2;

  @Input()
  public scrollDownPercentilePositionTrigger = 98;

  @Output()
  public onScrollUp: EventEmitter<null> = new EventEmitter<null>();

  @Output()
  public onScrollDown: EventEmitter<null> = new EventEmitter<null>();

  private scrollHeightListener: ScrollHeightListener;

  private scrollHeightChanged: Subject<null> = new Subject<null>();

  private domMutationObserver: MutationObserver;

  private domMutationEmitter: Subject<MutationRecord[]> = new Subject<MutationRecord[]>();

  private scrollChanged: Observable<Event>;

  private get scrollPairChanged(): Observable<ScrollPosition[]> {
    if (this.scrollChanged) {
      return this.scrollChanged.pipe(
        takeWhile(() => this.state.scrollStreamActive),
        map((e: any) => {
          return <ScrollPosition>{
            scrollHeight: e.target.scrollHeight,
            scrollTop: e.target.scrollTop,
            clientHeight: e.target.clientHeight,
          };
        }),
        pairwise(),
        debounceTime(this.scrollbarAnimationInterval)
      );
    }
  }

  private get scrollDirectionChanged(): Observable<ScrollPosition[]> {
    return this.scrollingStrategy.scrollDirectionChanged(this.scrollPairChanged);
  }

  private get scrollRequestZoneChanged(): Observable<ScrollPosition[]> {
    return this.scrollingStrategy.scrollRequestZoneChanged(this.scrollDirectionChanged).pipe(
      tap(() => {
        this.state.updatePreviousScrollTop();
        this.state.updatePreviousScrollHeight();
        this.state.previousScrollPositionpUpdated = false;
        this.scrollHeightListener.start();
      })
    );
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private state: DirectiveStateService
  ) {
    super();
    this.state.setup({
      el: el,
      initMode: true,
      scrollStreamActive: true,
      previousScrollPositionpUpdated: false
    });
  }

  public ngOnInit(): void {
    this.useStrategy();
    this.useScrollHeightListener();

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
    this.state.scrollStreamActive = false;
    this.renderer.setProperty(this.el.nativeElement, 'scrollTop', position);
    this.state.scrollStreamActive = true;
  }

  public onScrollbarHeightChanged(): void {
    this.scrollHeightChanged.next();
  }

  private registerScrollEventHandler(): void {
    this.scrollChanged = fromEvent(this.el.nativeElement, 'scroll');
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
    this.domMutationEmitter.pipe(
      takeWhile(() => this.state.initMode),
      debounceTime(this.scrollDebounceTimeAfterDOMMutationOnInit)
    ).subscribe(() => {
      this.scrollingStrategy.setInitialScrollPosition();
      this.state.initMode = false;
    });
  }

  private registerPreviousScrollPositionHandler(): void {
    zip(
      this.scrollRequestZoneChanged,
      this.scrollHeightChanged
    ).pipe(
      skipWhile(() => this.state.initMode),
      debounceTime(this.scrollDebounceTimeAfterScrollHeightChanged)
    ).subscribe(() => {
      this.scrollingStrategy.setPreviousScrollPosition();
      this.state.previousScrollPositionpUpdated = true;
    });
  }

  private registerScrollSpy(): void {
    this.scrollRequestZoneChanged.subscribe(() => {
      this.scrollingStrategy.askForUpdate();
    });
  }

  private useStrategy(): void {
    switch (this.strategy) {
      case 'scrollingToBoth':
        this.scrollingStrategy = new ScrollingToBoth(this, this.state);
        break;
      case 'scrollingToTop':
        this.scrollingStrategy = new ScrollingToTop(this, this.state);
        break;
      case 'scrollingToBottom': default:
        this.scrollingStrategy = new ScrollingToBottom(this, this.state);
        break;
    }
  }

  private useScrollHeightListener(): void {
    this.scrollHeightListener = new ScrollHeightListener(this, this.state);
  }
}
