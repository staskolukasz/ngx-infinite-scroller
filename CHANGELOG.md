# Changelog
All notable changes to this project will be documented in this file

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html)

## [0.3.0] - 2018-05-19
### Changed
- Updated to Angular 6

## [0.2.2] - 2018-03-12
### Changed
- BrowserModule removed from NgxInfiniteScrollerModule

## [0.2.1] - 2018-03-10
### Added
- CHANGELOG.md file
- DirectiveStateService (state management)
- ScrollHeightListener (used to listen to scrollbar height changes, instead of MutationObserver)

### Changed
- The way how previous scroll position is set
- Directive refactoring