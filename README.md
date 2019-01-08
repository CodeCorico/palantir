# palantir

## Project setup
```sh
npm install
```

### Compiles and hot-reloads for development
```sh
npm run serve
```

### Compiles and minifies for production
```sh
npm run build
```

### Run your tests
```sh
npm run test
```

### Lints and fixes files
```sh
npm run lint
```

### Changelog to Timeline

```sh
palantir changelog "../my-project/CHANGELOG.md" "./my-project.json"
```

### Documentation generator

```sh
palantir doc "../my-project/{*.md,\!(node_modules)/**/*.md}" "./my-project" "../my-project/"
```

### Internal variables

```json
"variables": {
  "upgrade.button": false, // no upgrade button in the header
  "upgrade.reload": false  // no automatic reload when the server's version changed
}
```
