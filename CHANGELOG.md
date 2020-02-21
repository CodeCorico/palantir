## [0.10.1](https://github.com/CodeCorico/palantir/compare/v0.10.0...v0.10.1) (2020-02-21)


### Bug Fixes

* move some dependencies to the devDependencies to build the Docker image



# [0.10.0](https://github.com/CodeCorico/palantir/compare/v0.9.0...v0.10.0) (2020-02-21)


### Bug Fixes

* apply the airbnb style ([9a78c07](https://github.com/CodeCorico/palantir/commit/9a78c075ea08c5201bc43747883908e472cc6a7c))
* **app bitbucket-pulls:** add an api to retrieve the data from the server ([8703b58](https://github.com/CodeCorico/palantir/commit/8703b58f1f6151b7fbd693e40aa2bef5635cde04))
* **app bitbucket-pulls:** create a unique key for indexing ([db74e88](https://github.com/CodeCorico/palantir/commit/db74e8849748bdb2246ed8b157d380b6b2329273))
* **app github-pulls:** add an api to retrieve the data from the server ([9e95fcd](https://github.com/CodeCorico/palantir/commit/9e95fcdb697c0100d272b6d86eadd4483ff35c62))
* **app github-pulls:** create a unique key for indexing ([0c530a5](https://github.com/CodeCorico/palantir/commit/0c530a5ddbb452aad4a3870ce39009b1fd98102f))
* **app jira-capacity:** disable the estimated weeks indicator ([bfeba90](https://github.com/CodeCorico/palantir/commit/bfeba909ef6335e6e8f7fba91b180ff775c42c84))
* **app jira-capacity:** move the secrets to the server side ([37383e8](https://github.com/CodeCorico/palantir/commit/37383e8c3e3193ce2c0ee65fa1701fdb6d8a05e9))
* **app jira-capacity:** replace global ChartJs by imported one ([c7a0ce8](https://github.com/CodeCorico/palantir/commit/c7a0ce8192848067f02580cacb8b04315e20ffa9)), closes [#25](https://github.com/CodeCorico/palantir/issues/25)
* **app jira-run:** use the worklogs to calculate the days worked ([ae81f59](https://github.com/CodeCorico/palantir/commit/ae81f5960716000f63fdd2e06df04fa2df50a55a))
* **app trello:** move the secrets to the server side ([e2ea0e3](https://github.com/CodeCorico/palantir/commit/e2ea0e35aed484532f4d25bce50150c8425f39f4))
* **app ui pull-chart:** replace global ChartJs by imported one ([ddbe1ac](https://github.com/CodeCorico/palantir/commit/ddbe1ac01a10f6249ad601a30f812645e4b962a0)), closes [#25](https://github.com/CodeCorico/palantir/issues/25)
* **apps:** wait for the config to be loaded before openning the first app ([30e9678](https://github.com/CodeCorico/palantir/commit/30e96783276e4a6b748c77b9d8071812358c0093))
* **cli:** use yargs.parse() to avoid disable linter rule ([db14d97](https://github.com/CodeCorico/palantir/commit/db14d97c44de79a9c5e2d4b6816ff529ecd804ec))
* **public:** remove chartjs and extensions from global injection ([6860b3b](https://github.com/CodeCorico/palantir/commit/6860b3ba31e288a3d95ef04da0cba45f7538329f)), closes [#25](https://github.com/CodeCorico/palantir/issues/25)
* **server:** use ENV variables instead of the "variables" config ([d94520a](https://github.com/CodeCorico/palantir/commit/d94520afacd8892be97bdbe133b58d2862297da1))
* **storybook:** remove storybook bootstrap ([08a7432](https://github.com/CodeCorico/palantir/commit/08a743208c9e8a03d79032d8dfb74a37b2c04180))


### Code Refactoring

* **app jira-capacity:** split the app in two apps ([44ca459](https://github.com/CodeCorico/palantir/commit/44ca45977ade87258260cfee384d00a85eb7cdff))


### Features

* **app grid:** change the positions parameters to be more css compliant ([65d7c8b](https://github.com/CodeCorico/palantir/commit/65d7c8b7b6658ff5408ed3398121799c534502f8))
* **app jira-roadmap:** create the new app ([b25d6c7](https://github.com/CodeCorico/palantir/commit/b25d6c7e536322728fdcc44b5e64e34ea9e7d878))
* **app jira-run:** add the technical debt graph line ([f066881](https://github.com/CodeCorico/palantir/commit/f06688131f07aa6ed6dbe0526e3135e0e5b3abe1))
* **config:** the client doesn't load the Palantir description secrets ([5c1c083](https://github.com/CodeCorico/palantir/commit/5c1c083d250e214a7f2936e23a4e2b8edaee733b))
* **env:** add a PALANTIR_FILE env variable ([c5d0cd5](https://github.com/CodeCorico/palantir/commit/c5d0cd5bb0bd9a9fdea6d44260c9a6f8c95c61d4))
* **tasks:** publish the app id to the tasks ([3fe6b4c](https://github.com/CodeCorico/palantir/commit/3fe6b4cd9882bfe84f31144031e831bfaad92499))


### Performance Improvements

* **app grid:** use webpack import() for code splitting ([97aa8b8](https://github.com/CodeCorico/palantir/commit/97aa8b8d300c876a82aa3aa400be975be3a378a7))
* **app speech-synthesis:** unable websocket only if needed ([d897c3f](https://github.com/CodeCorico/palantir/commit/d897c3f558fceaf03f9ec3bce2d6388b12a60bb2))
* **apps:** use webpack import() for code splitting ([572aeda](https://github.com/CodeCorico/palantir/commit/572aeda412db52afc621abe20977d194284aae71))
* **server:** change the server timeout to 10min ([72955c8](https://github.com/CodeCorico/palantir/commit/72955c875eea1c6cf614df4522940367896de7c5))


### BREAKING CHANGES

* **app jira-capacity:** The jira-capacity app only kept the epics graph.
The new jira-run app took the banner velocity and sprints graphs
* **app grid:** The grid apps positions parameters have changed.
"x" and "y" are now "left" and "top".
"right" and "bottom" have beend added
* **app jira-capacity:** The Jira Capacity "host", email" and "token" are now available in the
"secrets" app description instead of the "config" one.
* **app trello:** The Trello "key" and "token" are now available in the
"secrets" app description instead of the "config" one.
* **app github-pulls:** The Github "token" is now available in the
"secrets" app description instead of the "config" one.
* **app bitbucket-pulls:** The Bitbucket "username" and "password" are now available in the
"secrets" app description instead of the "config" one.
* **env:** The new env variable PALANTIR_FILE is needed to locate the
palantir.json description file.
* **server:** The "variables" config attribute is no longer supported.
Please use real ENV variables instead (in the .env file for example)



# [0.9.0](https://github.com/CodeCorico/palantir/compare/v0.8.0...v0.9.0) (2020-01-23)


### Bug Fixes

* **app freshteam:** align groups ([955244a](https://github.com/CodeCorico/palantir/commit/955244a))
* **app outlook-calendar:** filter the frame messages ([e5e8c00](https://github.com/CodeCorico/palantir/commit/e5e8c00))
* **app outlook-calendar:** remove duplicates events ([f7949e2](https://github.com/CodeCorico/palantir/commit/f7949e2))
* **app trello:** decrease the card height ([6a3df1c](https://github.com/CodeCorico/palantir/commit/6a3df1c))
* **app trello:** move the done ticker to the bottom ([92ce09b](https://github.com/CodeCorico/palantir/commit/92ce09b))
* **app trello:** return the string error on get tasks list ([1223d8a](https://github.com/CodeCorico/palantir/commit/1223d8a))
* **app-github-pulls:** add condition for oldMergeableState ([04314a9](https://github.com/CodeCorico/palantir/commit/04314a9))
* **app-github-pulls:** fix condition for changes ([4daba0a](https://github.com/CodeCorico/palantir/commit/4daba0a))
* **app-images-randomizer:** correct randomness ([759567c](https://github.com/CodeCorico/palantir/commit/759567c))
* **browser-extension jira:** decrease the update for 3 days on monday ([b8f4d8a](https://github.com/CodeCorico/palantir/commit/b8f4d8a))
* **browser-extensions jira:** change last update time check to 10:30 ([11aacf6](https://github.com/CodeCorico/palantir/commit/11aacf6))
* **browser-extensions outlook-calendar:** accept accents in regexs ([9f83b94](https://github.com/CodeCorico/palantir/commit/9f83b94))
* **browser-extensions outlook-calendar:** use the event border-color ([b3f6b3a](https://github.com/CodeCorico/palantir/commit/b3f6b3a))
* **services cron:** use clearTimeout() instead of clearInterval ([4a1c712](https://github.com/CodeCorico/palantir/commit/4a1c712)), closes [#10](https://github.com/CodeCorico/palantir/issues/10)
* **ui header:** better lock display ([b70bab4](https://github.com/CodeCorico/palantir/commit/b70bab4))
* **ui header:** remove the date time icon and fix the font ([9c88b9c](https://github.com/CodeCorico/palantir/commit/9c88b9c))
* **ui pull-chart:** update chart when values changes ([769b601](https://github.com/CodeCorico/palantir/commit/769b601))
* **ui pulls:** add missing 'ui-' in the component's name ([d135bac](https://github.com/CodeCorico/palantir/commit/d135bac))
* **ui user-target:** realign content on many items ([3e62b62](https://github.com/CodeCorico/palantir/commit/3e62b62))


### Features

* **app bitbucket-pulls:** create the app ([46c2962](https://github.com/CodeCorico/palantir/commit/46c2962))
* **app freshteam:** create the app ([8dc4e32](https://github.com/CodeCorico/palantir/commit/8dc4e32))
* **app jira-capacity:** create the new app ([045b7d0](https://github.com/CodeCorico/palantir/commit/045b7d0))
* **app jira-capacity jira-connector-extended:** add more api methods and fixes ([33f6c9e](https://github.com/CodeCorico/palantir/commit/33f6c9e))
* **app outlook-calendar:** create the app ([a5e26aa](https://github.com/CodeCorico/palantir/commit/a5e26aa))
* **app trello:** create the trello app ([0123aee](https://github.com/CodeCorico/palantir/commit/0123aee))
* **app-images-randomizer App:** play audio in start method ([99780b1](https://github.com/CodeCorico/palantir/commit/99780b1))
* **app-images-randomizer stores:** add sounds as a state ([8303d29](https://github.com/CodeCorico/palantir/commit/8303d29))
* **app-speech-synthesis:** add app-speech-synthesis ([54953d7](https://github.com/CodeCorico/palantir/commit/54953d7))
* **app-trello:** add default avatar for members who don't have one ([0ca65e7](https://github.com/CodeCorico/palantir/commit/0ca65e7))
* **app-trello:** add the possibility to override the avatars ([55e94b6](https://github.com/CodeCorico/palantir/commit/55e94b6))
* **browser-extension:** create the outlook-calendar injection ([633eab2](https://github.com/CodeCorico/palantir/commit/633eab2))
* **browser-extensions:** add icons ([1991287](https://github.com/CodeCorico/palantir/commit/1991287))
* **browser-extensions freshteam:** create the frame helper ([fd91535](https://github.com/CodeCorico/palantir/commit/fd91535))
* **browser-extensions freshteam:** sort requests by date ([403b745](https://github.com/CodeCorico/palantir/commit/403b745))
* **browser-extensions jira:** add a ctrl+alt+k shortcut to apply symbols ([c72c77b](https://github.com/CodeCorico/palantir/commit/c72c77b))
* **browser-extensions jira:** create the extension ([ca1c3bc](https://github.com/CodeCorico/palantir/commit/ca1c3bc))
* **browser-extensions outlook-calendar:** remove canceled events ([f543350](https://github.com/CodeCorico/palantir/commit/f543350))
* **cli changelog:** create the destination directory ([3254822](https://github.com/CodeCorico/palantir/commit/3254822))
* **doc assets palantir:** add the changelog app ([5a5057b](https://github.com/CodeCorico/palantir/commit/5a5057b))
* **github pulls:** add regex sort option ([b072e0a](https://github.com/CodeCorico/palantir/commit/b072e0a))
* **layouts page:** display a new lock feature ([6ce5f0d](https://github.com/CodeCorico/palantir/commit/6ce5f0d))
* **public:** add chartjs plugin datalabels ([d742b20](https://github.com/CodeCorico/palantir/commit/d742b20))
* **server:** add to the features the possibility to create apis ([c327e2e](https://github.com/CodeCorico/palantir/commit/c327e2e))
* **server:** listen to slack messages ([7d31a19](https://github.com/CodeCorico/palantir/commit/7d31a19))
* **store apps:** add root ([ae7fdc0](https://github.com/CodeCorico/palantir/commit/ae7fdc0))
* **store config:** remove error menu required ([432431b](https://github.com/CodeCorico/palantir/commit/432431b))
* **task:** launch a task commanded by slack ([e30f29e](https://github.com/CodeCorico/palantir/commit/e30f29e))
* **ui header:** fix animation problem on date in title with new animation ([9314c60](https://github.com/CodeCorico/palantir/commit/9314c60))
* **views page:** disable menu ([cb6d6da](https://github.com/CodeCorico/palantir/commit/cb6d6da))



# [0.8.0](https://github.com/CodeCorico/palantir/compare/v0.7.0...v0.8.0) (2019-02-11)


### Bug Fixes

* **app google-calendar:** better events display ([13d0191](https://github.com/CodeCorico/palantir/commit/13d0191))
* **app pages:** scroll on top after the page is loaded ([39e6f18](https://github.com/CodeCorico/palantir/commit/39e6f18))
* **ui variables:** change the page background ([a80a2a2](https://github.com/CodeCorico/palantir/commit/a80a2a2))


### Features

* **app pages:** add custom columns display for html markdown ([5c41374](https://github.com/CodeCorico/palantir/commit/5c41374))
* **app pages:** add json and bash code styles ([14c597e](https://github.com/CodeCorico/palantir/commit/14c597e))
* **app pages:** don't add a title in summary when it contains summary="false" ([387fbc7](https://github.com/CodeCorico/palantir/commit/387fbc7))
* **app pages:** new pages design ([8bde84e](https://github.com/CodeCorico/palantir/commit/8bde84e))


### BREAKING CHANGES

* **app pages:** The new design is inspired by the Material.io doc.
It manages relative images, better code style support and devices screen
sizes



# [0.7.0](https://github.com/CodeCorico/palantir/compare/v0.6.1...v0.7.0) (2019-01-27)


### Bug Fixes

* **app github-pulls:** check changes requested by user ([fd916d8](https://github.com/CodeCorico/palantir/commit/fd916d8))
* **layout page:** check for new version every hour instead of 5 minutes ([85cf94f](https://github.com/CodeCorico/palantir/commit/85cf94f))


### Features

* **app google-calendar:** create the app ([6946566](https://github.com/CodeCorico/palantir/commit/6946566))
* **app grid:** create the app ([2c0e4b4](https://github.com/CodeCorico/palantir/commit/2c0e4b4))
* **apps:** add a switch tasks mutation ([f56bdc8](https://github.com/CodeCorico/palantir/commit/f56bdc8))
* **layout page:** add global links style ([07a2c6a](https://github.com/CodeCorico/palantir/commit/07a2c6a))



## [0.6.1](https://github.com/CodeCorico/palantir/compare/v0.6.0...v0.6.1) (2019-01-24)


### Bug Fixes

* **app github-pulls:** use github /reviews and /status api to display the icons states ([5bc0268](https://github.com/CodeCorico/palantir/commit/5bc0268))



# [0.6.0](https://github.com/CodeCorico/palantir/compare/v0.5.1...v0.6.0) (2019-01-23)


### Bug Fixes

* **app github-pulls:** sort PR in groups ([4a4b0b3](https://github.com/CodeCorico/palantir/commit/4a4b0b3)), closes [#9](https://github.com/CodeCorico/palantir/issues/9)
* **app pages:** add better flow chart css ([3ee99bc](https://github.com/CodeCorico/palantir/commit/3ee99bc))
* **app pages:** don't break relative urls ([4a77f67](https://github.com/CodeCorico/palantir/commit/4a77f67))
* **app pages:** don't display the summary if empty ([084b8ac](https://github.com/CodeCorico/palantir/commit/084b8ac))


### Features

* **ui file-tree:** display icons instead of extensions ([6f65a48](https://github.com/CodeCorico/palantir/commit/6f65a48))



## [0.5.1](https://github.com/CodeCorico/palantir/compare/v0.5.0...v0.5.1) (2019-01-14)


### Bug Fixes

* **app pages:** relative links support new files extensions ([87994a5](https://github.com/CodeCorico/palantir/commit/87994a5))


### Features

* **app pages:** add table & mermaid container styles ([189d7ad](https://github.com/CodeCorico/palantir/commit/189d7ad))



# [0.5.0](https://github.com/CodeCorico/palantir/compare/v0.4.0...v0.5.0) (2019-01-13)


### Bug Fixes

* **app images-randomizer:** don't display the border animation on transparent images ([26026ad](https://github.com/CodeCorico/palantir/commit/26026ad))
* **ui file-tree:** capitalize only the first character ([fc9429a](https://github.com/CodeCorico/palantir/commit/fc9429a))
* **ui scrolls:** don't loose the handling when scrolling outside the window ([7dbdfb7](https://github.com/CodeCorico/palantir/commit/7dbdfb7))


### Features

* **app error:** create the error app ([55d862e](https://github.com/CodeCorico/palantir/commit/55d862e))
* **app pages:** display mermaid diagrams ([aeea1c5](https://github.com/CodeCorico/palantir/commit/aeea1c5))
* **apps:** inform the user when it is on a unknown app ([1715807](https://github.com/CodeCorico/palantir/commit/1715807))
* **cli commands doc:** process .mmd (mermaid) files ([718fafe](https://github.com/CodeCorico/palantir/commit/718fafe))
* **config:** add a palantir.json config validator ([a1c3d1c](https://github.com/CodeCorico/palantir/commit/a1c3d1c))
* **tasks task:** add keyboard "shortcut" to tasks ([33b6093](https://github.com/CodeCorico/palantir/commit/33b6093))


### Performance Improvements

* **ui scrolls:** don't create scrollbars DOM when not needed ([7c4a0cd](https://github.com/CodeCorico/palantir/commit/7c4a0cd))



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



