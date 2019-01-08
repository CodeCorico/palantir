# [0.4.0](https://github.com/CodeCorico/palantir/compare/v0.3.1...v0.4.0) (2019-01-08)


### Bug Fixes

* **app images-randomizer:** starting a new process kills the active one ([b14857b](https://github.com/CodeCorico/palantir/commit/b14857b))
* **app pages:** missing loading the data when changing the app id ([89208d9](https://github.com/CodeCorico/palantir/commit/89208d9))
* **ui header:** adapt right button bar on locked mode ([daafb90](https://github.com/CodeCorico/palantir/commit/daafb90))


### Features

* **config:** add variables as a state ([3933f9d](https://github.com/CodeCorico/palantir/commit/3933f9d))
* **layout page:** reload the page when the server's version changed ([428310c](https://github.com/CodeCorico/palantir/commit/428310c))
* **layout page:** use variables to disable the upgrade features ([fc74929](https://github.com/CodeCorico/palantir/commit/fc74929))


### Performance Improvements

* **app github-pulls:** clear the store when destroying the app ([18de5b7](https://github.com/CodeCorico/palantir/commit/18de5b7))
* **app pages:** clear the store when destroying the app ([c3f5b45](https://github.com/CodeCorico/palantir/commit/c3f5b45))
* **app timeline:** clear the store when destroying the app ([ae4a8f0](https://github.com/CodeCorico/palantir/commit/ae4a8f0))



## [0.3.1](https://github.com/CodeCorico/palantir/compare/v0.3.0...v0.3.1) (2019-01-07)


### Bug Fixes

* **app github-pulls:** use comments as number instead of array ([74e6c6a](https://github.com/CodeCorico/palantir/commit/74e6c6a))



# [0.3.0](https://github.com/CodeCorico/palantir/compare/v0.2.0...v0.3.0) (2019-01-06)


### Bug Fixes

* **app github-pulls:** sounds changes & clean pulls cache ([b88ad82](https://github.com/CodeCorico/palantir/commit/b88ad82))
* **app timeline:** better column popin content display ([e5a301d](https://github.com/CodeCorico/palantir/commit/e5a301d))
* **app timeline:** events alignment ([5b30771](https://github.com/CodeCorico/palantir/commit/5b30771))
* **app timeline:** input always cleaning ([1c8f9cd](https://github.com/CodeCorico/palantir/commit/1c8f9cd))
* **app timeline:** refresh the minimap after data loaded ([a23c4dd](https://github.com/CodeCorico/palantir/commit/a23c4dd))
* **app timeline:** reload data when the app config changed ([760fe5b](https://github.com/CodeCorico/palantir/commit/760fe5b))
* **app timeline:** unselect popin content when switching app ([df56f8a](https://github.com/CodeCorico/palantir/commit/df56f8a))
* **apps:** disable linked cron task when the app is exited ([063495e](https://github.com/CodeCorico/palantir/commit/063495e))
* **tasks:** create a new attr instead of rewrite the id ([8df79bc](https://github.com/CodeCorico/palantir/commit/8df79bc))


### Features

* **app github-pulls:** add merged sound ([e9187d4](https://github.com/CodeCorico/palantir/commit/e9187d4))
* **app github-pulls:** add new pull animation ([17c56d4](https://github.com/CodeCorico/palantir/commit/17c56d4))
* **app timeline:** add performance improvements support ([547792c](https://github.com/CodeCorico/palantir/commit/547792c))
* **cli changelog-command:** add performance improvements support ([7606ec3](https://github.com/CodeCorico/palantir/commit/7606ec3))
* **layout page:** add a link when the Palantir is not up to date ([ea805d6](https://github.com/CodeCorico/palantir/commit/ea805d6))



# [0.2.0](https://github.com/CodeCorico/palantir/compare/v0.1.8...v0.2.0) (2019-01-02)


### Bug Fixes

* **docker:** add missing execution rights on the docker-entrypoint ([71f20a2](https://github.com/CodeCorico/palantir/commit/71f20a2))


### Features

* **app github-pulls:** add new & unclean commits sounds + better state icons ([4be49e6](https://github.com/CodeCorico/palantir/commit/4be49e6))
* **cli config-chain:** add config.reset() & config.data() ([9e51a87](https://github.com/CodeCorico/palantir/commit/9e51a87))



## [0.1.8](https://github.com/CodeCorico/palantir/compare/v0.1.7...v0.1.8) (2018-12-27)


### Bug Fixes

* **cli changelog-command:** better logs ([e072e36](https://github.com/CodeCorico/palantir/commit/e072e36))
* **cli config-chain:** better logs ([581fe6b](https://github.com/CodeCorico/palantir/commit/581fe6b))


### Features

* **cli script-command:** serve the glob module ([ca14f60](https://github.com/CodeCorico/palantir/commit/ca14f60))



## [0.1.7](https://github.com/CodeCorico/palantir/compare/v0.1.6...v0.1.7) (2018-12-27)


### Features

* **cli console-format:** add the log error format ([e1955b4](https://github.com/CodeCorico/palantir/commit/e1955b4))
* **cli script-command:** create the script with config chain feature ([1b4fc74](https://github.com/CodeCorico/palantir/commit/1b4fc74))



## [0.1.6](https://github.com/CodeCorico/palantir/compare/v0.1.5...v0.1.6) (2018-12-19)


### Performance Improvements

* **docker:** use npm pack instead of npm link to install the cli ([889a381](https://github.com/CodeCorico/palantir/commit/889a381))



## [0.1.5](https://github.com/CodeCorico/palantir/compare/v0.1.4...v0.1.5) (2018-12-19)


### Bug Fixes

* **cli changelog:** migrate the changelog script to the cli ([eb4ac08](https://github.com/CodeCorico/palantir/commit/eb4ac08))
* **cli doc:** migrate the documentation script to the cli ([655b403](https://github.com/CodeCorico/palantir/commit/655b403))


### Features

* **cli:** create the cli bootstrap ([842ca46](https://github.com/CodeCorico/palantir/commit/842ca46))
* **docker:** link the cli in the image ([8cc3790](https://github.com/CodeCorico/palantir/commit/8cc3790))



## [0.1.4](https://github.com/CodeCorico/palantir/compare/v0.1.3...v0.1.4) (2018-12-17)


### Bug Fixes

* **layout page:** move the sidebars & header buttons logics in a store ([b5469a9](https://github.com/CodeCorico/palantir/commit/b5469a9))
* **ui scrolls:** the block display is the new default ([87dec8d](https://github.com/CodeCorico/palantir/commit/87dec8d))


### Features

* **app frame:** create the iframe app ([30030b3](https://github.com/CodeCorico/palantir/commit/30030b3))
* **app pages:** add content styles ([177a3c8](https://github.com/CodeCorico/palantir/commit/177a3c8))
* **app pages:** create a glossary ([020ed66](https://github.com/CodeCorico/palantir/commit/020ed66))
* **app pages:** create a summary ([ac5d6e6](https://github.com/CodeCorico/palantir/commit/ac5d6e6))
* **scripts documentation:** generate the glossary ([469c62d](https://github.com/CodeCorico/palantir/commit/469c62d))



## [0.1.3](https://github.com/CodeCorico/palantir/compare/v0.1.2...v0.1.3) (2018-12-16)


### Features

* **app pages:** create the app ([3164474](https://github.com/CodeCorico/palantir/commit/3164474))
* **apps app:** add support for nested routes in apps ([00a79b1](https://github.com/CodeCorico/palantir/commit/00a79b1))
* **scripts documentation:** create a documentation generator ([cc5bf7a](https://github.com/CodeCorico/palantir/commit/cc5bf7a))
* **ui scrolls:** add the content display type prop ([c3501d6](https://github.com/CodeCorico/palantir/commit/c3501d6))



## [0.1.2](https://github.com/CodeCorico/palantir/compare/v0.1.1...v0.1.2) (2018-12-15)


### Features

* **docker:** add flexible docker-entrypoint hooks ([63ea45f](https://github.com/CodeCorico/palantir/commit/63ea45f))


### Performance Improvements

* **docker:** use multi-stages for the image size ([8c1357a](https://github.com/CodeCorico/palantir/commit/8c1357a))



## 0.1.1 (2018-12-15)


### Bug Fixes

* refactor stores in package by feature & start the tasks ([a4240f7](https://github.com/CodeCorico/palantir/commit/a4240f7))
* **app images-randomizer:** taller z-index ([1721694](https://github.com/CodeCorico/palantir/commit/1721694))
* **config:** package json add nodesass + addon storybook ([fa701f1](https://github.com/CodeCorico/palantir/commit/fa701f1))
* **docker:** remove test RUN ([c17b8a8](https://github.com/CodeCorico/palantir/commit/c17b8a8))
* **layout dashboard-page:** cache PR animations states for reloading ([65e9e59](https://github.com/CodeCorico/palantir/commit/65e9e59))
* **layout dashboard-page:** clearer design ([af5beb8](https://github.com/CodeCorico/palantir/commit/af5beb8)), closes [#3](https://github.com/CodeCorico/palantir/issues/3) [#4](https://github.com/CodeCorico/palantir/issues/4)
* **layout page:** add taller sidebars z-index ([703d9df](https://github.com/CodeCorico/palantir/commit/703d9df))
* **layout page:** change the main font by Montserrat ([ea14ddb](https://github.com/CodeCorico/palantir/commit/ea14ddb))
* **public:** new favicons ([83da72b](https://github.com/CodeCorico/palantir/commit/83da72b))
* **storybook config:** importing sidebar in config storybook ([06dbf60](https://github.com/CodeCorico/palantir/commit/06dbf60))
* **ui header:** animate date time & manage destroyed ([819c815](https://github.com/CodeCorico/palantir/commit/819c815))


### Features

* connect the tasks ui to the real tasks ([3efdd59](https://github.com/CodeCorico/palantir/commit/3efdd59))
* create the apps system with the palantir.json config ([9f4cc3e](https://github.com/CodeCorico/palantir/commit/9f4cc3e))
* new design ([d84670a](https://github.com/CodeCorico/palantir/commit/d84670a))
* **app github-pulls:** add the ui-scrolls for the page ([d1f3a12](https://github.com/CodeCorico/palantir/commit/d1f3a12))
* **app images-randomizer:** create the app ([41b0d44](https://github.com/CodeCorico/palantir/commit/41b0d44))
* **app timeline:** add a content panel ([ce0169b](https://github.com/CodeCorico/palantir/commit/ce0169b))
* **app timeline:** add an "idle" date ticker when an event is idle ([2a6396d](https://github.com/CodeCorico/palantir/commit/2a6396d))
* **app timeline:** add the filters ([7c09d23](https://github.com/CodeCorico/palantir/commit/7c09d23))
* **app timeline:** create the app design ([1173578](https://github.com/CodeCorico/palantir/commit/1173578))
* **app timeline:** disable column on re-click ([756d18a](https://github.com/CodeCorico/palantir/commit/756d18a))
* **app timeline:** insert & manage the timeline-minimap ([51b6f9c](https://github.com/CodeCorico/palantir/commit/51b6f9c))
* **app timeline:** move data into a loaded store ([8f948c3](https://github.com/CodeCorico/palantir/commit/8f948c3))
* **app timeline:** process timeline data ([7bc0e2a](https://github.com/CodeCorico/palantir/commit/7bc0e2a))
* **app timeline minimap:** create the component ([931e893](https://github.com/CodeCorico/palantir/commit/931e893))
* **bootstrap:** install vue-router ([029c9ab](https://github.com/CodeCorico/palantir/commit/029c9ab))
* **bootstrap server:** create the express server ([e3cfff1](https://github.com/CodeCorico/palantir/commit/e3cfff1))
* **cron:** add the manual, interval & daily modes ([253a1a0](https://github.com/CodeCorico/palantir/commit/253a1a0))
* **docker:** create the docker architecture ([3c10b51](https://github.com/CodeCorico/palantir/commit/3c10b51))
* **header:** add the logo ([1c3c433](https://github.com/CodeCorico/palantir/commit/1c3c433))
* **initial:** create project with vuecli 3 ([ed091ad](https://github.com/CodeCorico/palantir/commit/ed091ad))
* **layout:** create the link between the header buttons and sidebars ([8040159](https://github.com/CodeCorico/palantir/commit/8040159))
* **layout dashboard:** working on the design ([db20cf6](https://github.com/CodeCorico/palantir/commit/db20cf6))
* **layout dashboard-page:** add the PR display state ([e4ebdec](https://github.com/CodeCorico/palantir/commit/e4ebdec)), closes [#1](https://github.com/CodeCorico/palantir/issues/1)
* **layout dashboard-page:** create the PRs view ([3dfcdf4](https://github.com/CodeCorico/palantir/commit/3dfcdf4))
* **layout dashboard-page:** load real pulls from gtihub ([458928f](https://github.com/CodeCorico/palantir/commit/458928f))
* **layout dashboard-page:** working on the dashboard ([4382001](https://github.com/CodeCorico/palantir/commit/4382001))
* **layout store prs:** sort prs & set spaceIndex ([3c3fb38](https://github.com/CodeCorico/palantir/commit/3c3fb38))
* **page:** init the header & layout ([59704eb](https://github.com/CodeCorico/palantir/commit/59704eb))
* **public:** add favicons ([51b568c](https://github.com/CodeCorico/palantir/commit/51b568c))
* **scripts changelog-to-timeline:** create a parser script ([fe30903](https://github.com/CodeCorico/palantir/commit/fe30903))
* **stories:** add first storie for sidebar and header ([dcb1bfd](https://github.com/CodeCorico/palantir/commit/dcb1bfd))
* **storybook:** add bootstrap folder with config file ([f861331](https://github.com/CodeCorico/palantir/commit/f861331))
* **storybook:** adding storybook package ([cb18545](https://github.com/CodeCorico/palantir/commit/cb18545))
* **ui accordion:** create the main sidebar accordion ([16a0f41](https://github.com/CodeCorico/palantir/commit/16a0f41))
* **ui accordion-item:** add a selector filter ([2dab648](https://github.com/CodeCorico/palantir/commit/2dab648))
* **ui header:** add buttons: design, behaviors, props & events ([f6d28a6](https://github.com/CodeCorico/palantir/commit/f6d28a6))
* **ui header:** add the lock mode ([a9d43ca](https://github.com/CodeCorico/palantir/commit/a9d43ca))
* **ui header:** display date time ([37c1827](https://github.com/CodeCorico/palantir/commit/37c1827))
* **ui pr-chart:** create the component ([14e41bb](https://github.com/CodeCorico/palantir/commit/14e41bb))
* **ui scrolls:** add the possibilit to set directly the scroll position ([f90c5de](https://github.com/CodeCorico/palantir/commit/f90c5de))
* **ui scrolls:** create the custom scrolls component ([6f0e131](https://github.com/CodeCorico/palantir/commit/6f0e131))
* **ui sidebar:** animate the open/close actions ([afe0f25](https://github.com/CodeCorico/palantir/commit/afe0f25))
* **ui sidebar:** close sidebar on navigation ([8b812a9](https://github.com/CodeCorico/palantir/commit/8b812a9))
* **ui task:** create the task component ([053c0bc](https://github.com/CodeCorico/palantir/commit/053c0bc))



