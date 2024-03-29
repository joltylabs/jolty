# Changelog

All notable changes to this project will be documented in this file.
## [0.5.1] - 2023-10-15
### Fixed
- fix errors when the transition option is false
- fix preventScroll when another component is open
- fix autofocus when focusTrap is disabled
### Removed
- remove ignoreConditions and ignoreAutofocus toggle options
## [0.5.0] - 2023-10-14
### Changed
- rename .ui-dialog-prevent-scroll class to .ui-prevent-scroll
### Added
- add preventScroll option to the Popover and Dropdown components
- add hidden-until-found hideMode
- add initTab and destroyTab events to the Tablist component
## [0.4.6] - 2023-10-07
### Fixed
- fix Dialog, Tablist and Toast tabindex attribute
- fix Tablist set instance
- fix Tablist destroy without arguments
## [0.4.5] - 2023-09-30
### Fixed
- fix memory leak
## [0.4.4] - 2023-09-30
### Fixed
- fix hover with click interaction
## [0.4.3] - 2023-09-28
### Fixed
- fix instances duplication
- fix floatings performance
## [0.4.2] - 2023-09-28
### Fixed
- set the state when the element is not shown by default
- fix the uuid and dialog destroy method
## [0.4.1] - 2023-09-27
### Fixed
- fix sticky position when zooming
## [0.4] - 2023-09-27
### Fixed
- fix breakpoints
- fix hide by Escape key
### Changed
- remove popoverApi, safeModal, topLayerForce options
- change floatings delay from 200ms to 150ms
- remove hideMode class option
### Added
- add moveToRoot and root options
- add 'class-hidden' and 'class-shown' values to the hideMode option
## [0.3.7] - 2023-09-24
### Fixed
- fix Tablist transition
- fix floating zoom
- opts property for all components
### Changed
- change Tablist tabpanel option to accept HTMLElements
### Added
- allow to inherit options from the data option
## [0.3.6] - 2023-09-23
### Fixed
- fix Tablist awaitAnimation
- fix trigger with hover and click behavior
### Changed
- change itemClickHide option to accept CSSSelector, HTMLElements or function
## [0.3.5] - 2023-09-17
### Fixed
- update build
## [0.3.4] - 2023-09-17
### Fixed
- Fix tablist awaitAnimation and arrowActivation options
### Changed
- rename floating z-index variable
### Added
- add Tablist item role

## [0.3.3] - 2023-09-17
### Fixed
- Fix dropdown dropdownActiveClass option
### Added
- Add toastClassActive option to the Toast component
- Add contentClassActive option to the Dialog component
- Add tooltipClassActive option to the Tooltip component

## [0.3.2] - 2023-09-17
### Fixed
- fix floating in browsers that do not support Popover API

## [0.3.1] - 2023-09-17
### Fixed
- Fix hideMode 'class'
