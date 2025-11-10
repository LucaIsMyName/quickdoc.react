# Changelog

Changelog for the QuickDoc React versions.

### v0.1.8

### Bugfixes

- fixed `<Example />` Compoents and MDX loading

## v0.1.7

### Features

- Implemented `config.enableNumberedSidebar`
- Implemented code highlighting with tailwind css variables
- Copy Button in Codeblock are now themes

### Bugfixes

- fixed  `config.enableNumberedSidebar` Bugs
- fixed `<Copy />`generic styling by adding border-radius and border-size on `config.theme.border` & `border.theme.radius` keys
- fixed `<Search />` generic styling by adding border-radius and border-size on `config.theme.border` & `border.theme.radius` keys
- fixed `<SidebarWidthControl />` position absolute issue to position fixed style solution

## v0.1.6

### Features

- Simplified color schema by just providing a `primary` color and app does the rest
- Implemented `config.theme.radius` Logic
- Implemented `config.theme.border` Logic
- Implemented `config.search.enableFuzzySearch` Logic, makes fuzzy search opt-in
### Bugfixes

- fixed `<DarkModeToggle />` placement
- fixed `<TabNavigation />` padding issue
- fixed print PDF (more testing needed)
- fixed `<ScrollFade />` blur issue (by removing the blur)


## v0.1.5

### Bugfixes

- fixed `<ExportButton />` placement

## v0.1.4

### Features

- Added print styles for PDF export
- Added MD Export

## v0.1.3

### Features

- Added Cmdk Search and fuzzyFindJS
- Added pagination on Top or Bottom

### Bugfixes

- updated `<Sidebar />` and `<TabNavigation />` work and set #id's
- no constant re-render anymore
- Fixed `<Sidebar />` inner sub-items width issue - overlow-x

## v0.1.0

Initial release

