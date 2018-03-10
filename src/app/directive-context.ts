import { ScrollingStrategy } from './model/scrolling-strategy.model';

export abstract class DirectiveContext {

  protected scrollingStrategy: ScrollingStrategy;

  constructor() { }
}
