import { ElementRef, Injectable } from '@angular/core';

@Injectable()
export class DirectiveStateService {

  public get scrollTop(): number {
    return this._el.nativeElement.scrollTop;
  }

  public get scrollHeight(): number {
    return this._el.nativeElement.scrollHeight;
  }

  public get clientHeight(): number {
    return this._el.nativeElement.clientHeight;
  }

  public get initMode(): boolean {
    return this._initMode;
  }

  public set initMode(initMode: boolean) {
    this._initMode = initMode;
  }

  public get scrollStreamActive(): boolean {
    return this._scrollStreamActive;
  }

  public set scrollStreamActive(active: boolean) {
    this._scrollStreamActive = active;
  }

  public get previousScrollPositionpUpdated(): boolean {
    return this._previousScrollPositionpUpdated;
  }

  public set previousScrollPositionpUpdated(previousScrollPositionpUpdated: boolean) {
    this._previousScrollPositionpUpdated = previousScrollPositionpUpdated;
  }

  public get previousScrollTop(): number {
    return this._previousScrollTop;
  }

  public get previousScrollHeight(): number {
    return this._previousScrollHeight;
  }

  private _el: ElementRef;

  private _initMode: boolean;

  private _scrollStreamActive: boolean;

  private _previousScrollPositionpUpdated: boolean;

  private _previousScrollTop: number;

  private _previousScrollHeight: number;

  public setup(params: {
    el: ElementRef,
    initMode: boolean,
    scrollStreamActive: boolean,
    previousScrollPositionpUpdated: boolean
  }): void {
    this._el = params.el;
    this._initMode = params.initMode;
    this._scrollStreamActive = params.scrollStreamActive;
    this._previousScrollPositionpUpdated = params.previousScrollPositionpUpdated;
    this.updatePreviousScrollTop();
    this.updatePreviousScrollHeight();
  }

  public updatePreviousScrollTop(): void {
    this._previousScrollTop = this._el.nativeElement.scrollTop;
  }

  public updatePreviousScrollHeight(): void {
    this._previousScrollHeight = this._el.nativeElement.scrollHeight;
  }
}
