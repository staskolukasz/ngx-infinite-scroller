import { ScrollingStrategy } from "./scrolling-strategy";
import { ElementRef, Renderer2, NgZone, Input, Output, EventEmitter, AfterViewInit, OnInit, OnDestroy } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { ScrollPosition } from "../model/scroll-position.model";

export abstract class DirectiveContext {

  protected scrollingStrategy: ScrollingStrategy;

  constructor(
    public el: ElementRef,
    public renderer: Renderer2
  ) { }
}