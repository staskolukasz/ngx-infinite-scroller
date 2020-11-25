# Changelog
All notable changes to this project will be documented in this file

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html)

## [0.6.3] - 2020-11-25
### Changed
- Documentation fixes

## [0.6.2] - 2020-11-25
### Changed
- Update to Angular 11

## [0.6.1] - 2020-03-11
### Changed
- Documentation fixes

## [0.6.0] - 2020-03-11
### Changed
- Update to Angular 9

## [0.5.0] - 2019-09-23
### Changed
- Update to Angular 8
- Update documentation and sample application to prevent duplicate http requests on scroll event
- In server side rendering mutation observer is not used anymore.

## [0.4.5] - 2019-07-16
### Changed
- Fix npm vulnerables (lodash from 4.17.11 to 4.17.14)

## [0.4.4] - 2019-05-15
### Changed
- Fix npm vulnerables and npm update packages

## [0.4.1] - 2019-01-22
### Changed
- Readme.md updated (fix Angular version)

## [0.4.0] - 2019-01-22
### Added
- Added support of custom values of initial scroll position
- Readme.md updated (initialScrollPosition input)

### Changed
- Updated to Angular 7

## [0.3.5] - 2018-08-24
### Changed
- Readme.md updated (new rxjs syntax)
- NPM packages updated

## [0.3.4] - 2018-05-19
### Changed
- Changelog updated

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