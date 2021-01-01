# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.2.1](https://github.com/grid-js/gridjs/compare/3.2.0...3.2.1) (2021-01-01)


### Bug Fixes

* MessageRow click won't trigger rowClick event ([5e13468](https://github.com/grid-js/gridjs/commit/5e13468691a897d9e6dcff67355c11ad8f659178))





# [3.2.0](https://github.com/grid-js/gridjs/compare/3.1.0...3.2.0) (2020-12-14)


### Features

* **grid:** extending className config and improving the pagination plugin a11y ([c4aa44d](https://github.com/grid-js/gridjs/commit/c4aa44d91a7285456bcc7f59a12fcfb426faa095))





# [3.1.0](https://github.com/grid-js/gridjs/compare/3.0.2...3.1.0) (2020-12-02)


### Bug Fixes

* using createRef instead of useRef in header and footer ([64b2371](https://github.com/grid-js/gridjs/commit/64b2371ad12b51a9e79cd353ed6b2a1b73681705))





## [3.0.2](https://github.com/grid-js/gridjs/compare/3.0.1...3.0.2) (2020-11-15)


### Bug Fixes

* **sort:** button background-color ([c8838a0](https://github.com/grid-js/gridjs/commit/c8838a0b4fd146d750e903f5659df9e87c9beb7d))





## [3.0.1](https://github.com/grid-js/gridjs/compare/3.0.0-alpha.2...3.0.1) (2020-11-15)


### Bug Fixes

* **sort:** button width and height ([95a1221](https://github.com/grid-js/gridjs/commit/95a1221f74447d5c4b2ffa00268ea1d79cdd04cc))
* **sort:** using SVG icons and fixing the border issue ([94ba245](https://github.com/grid-js/gridjs/commit/94ba245a8750baaab25ade1b1a1f14f2e06272f1))





# [3.0.0-alpha.2](https://github.com/grid-js/gridjs/compare/3.0.0-alpha.1...3.0.0-alpha.2) (2020-11-08)

**Note:** Version bump only for package gridjs





# [3.0.0-alpha.1](https://github.com/grid-js/gridjs/compare/2.1.0...3.0.0-alpha.1) (2020-11-08)


### Bug Fixes

* **plugin:** PluginRenderer should either accept PluginID or PluginPosition ([a95bba1](https://github.com/grid-js/gridjs/commit/a95bba1823fa56c48e0145aeb5aef9e2001940d7))
* removing the checkbox plugin from gridjs ([a88a91b](https://github.com/grid-js/gridjs/commit/a88a91bb4181d903eba10fd479c7078c18aa086d))
* **checkbox:** shared store ([374500c](https://github.com/grid-js/gridjs/commit/374500c3e5ccfa2cc64b03c9ca6d294284c0fe92))
* **checkbox:** updating the TD and TH renderer ([a5337ef](https://github.com/grid-js/gridjs/commit/a5337efc8deb1e702487f166dda29c810c7e0c50))
* **header:** adding plugin config to column ([6582928](https://github.com/grid-js/gridjs/commit/65829286cf9b10fcef563afa2003f2c4ab8fbdf6))
* **plugin:** types ([5240c89](https://github.com/grid-js/gridjs/commit/5240c8903e02437c9cf2f653f15c887422e93c6a))
* **plugin:** types ([a0c2a6e](https://github.com/grid-js/gridjs/commit/a0c2a6e8fa0e1754e72ab9d03dcb62352f1d92e1))
* **shadowTable:** simplyfing the ShadowTable component ([290416a](https://github.com/grid-js/gridjs/commit/290416a08cbd8118b077bb788de1ac0bd7737ee5))


### Features

* **row:** adding cell(index: number) function ([c15ed37](https://github.com/grid-js/gridjs/commit/c15ed378ce59f9683b93f53db9c2273ecad93cc7))
* adding Lerna ([f1a0563](https://github.com/grid-js/gridjs/commit/f1a0563d791f2d14ec54431ae111dc32e9eeda3c))
* **plugin:** adding PluginBaseComponent ([892cbb1](https://github.com/grid-js/gridjs/commit/892cbb1af3ed9b037756e0db205d69810fb2db65))

### BREAKING CHANGES

* `columns.selector` has been replaced with `columns.data`, e.g:

```js
{
  columns: [{
    data: (row) => row.name.first, // instead of `selector`
    name: 'First Name'
  }, {
    data: (row) => row.name.last,
    name: 'Last Name'
  }]
}
```
