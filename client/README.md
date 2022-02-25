# vue3-typescript

## Project setup
```sh
npm install
```

## Shell Script info

* added a style names console output for bulma classnames for quick viewing in the console and showing console ascii character options
```sh
npm run showColors
```

* To run any tests, the front end application MUST be running on localhost:8080

* for the accepting of regression changes
pass in an environment variable before typing the npm script
```sh
SPECNAME='somespecname.spec.ts'
```

* Example
```sh
SPECNAME='HomeRegression.spec.ts' npm run acceptChanges
```

* When creating a new regression test for a particular view, one must create the directories to place the base, actual, and diff screenshots 
* here is a script that will create those directories by passing the name of the test file as the first argument after the script

```sh
npm run regressionDirs:create 'yournewspecname.spec.ts'
```

* Now Recommended to run cypress tests in headless chrome because running the headed chrome with a resized window adjusts the viewport and the screenshots are not consistent unless the actual cypress headed chrome window is sized specifically the same everytime which It might not be depending on any user's monitor resolution.
```sh
# to run all spec files use '*' as the SPECNAME variable.
# otherwise specify a test such as HomeRegression.spec.ts
SPECNAME='*' npm run cy:run
# OR
SPECNAME='HomeRegression.spec.ts' npm run cy:run
```

* If still want to use cypress window tester proceed with caution as this can cause inconsistencies in the regression tests
```sh
npm run cy:open
```

---

### Compiles and minifies for production
```sh
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
