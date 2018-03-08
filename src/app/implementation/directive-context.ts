import {
  ElementRef,
  Renderer2
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ScrollingStrategy } from './scrolling-strategy';
import { ScrollPosition } from '../model/scroll-position.model';

export abstract class DirectiveContext {

  protected scrollingStrategy: ScrollingStrategy;

  constructor(
    public el: ElementRef,
    public renderer: Renderer2
  ) { }
}
